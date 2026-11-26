import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const STATUS_BADGE = {
  aberto: 'bg-sky-100 text-sky-800',
  em_tramitacao: 'bg-amber-100 text-amber-800',
  aguardando_assinatura: 'bg-purple-100 text-purple-800',
  concluido: 'bg-emerald-100 text-emerald-800',
  arquivado: 'bg-slate-200 text-slate-700',
};

const STATUS_LABEL = {
  aberto: 'Aberto',
  em_tramitacao: 'Em Tramitação',
  aguardando_assinatura: 'Aguardando Assinatura',
  concluido: 'Concluído',
  arquivado: 'Arquivado',
};

function preencherModelo(template, processo) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  return template
    .replaceAll('{{numero_protocolo}}', processo.numero_protocolo || '')
    .replaceAll('{{interessado_nome}}', processo.interessado_nome || '')
    .replaceAll('{{interessado_documento}}', processo.interessado_documento || '')
    .replaceAll('{{assunto}}', processo.assunto || '')
    .replaceAll('{{data_atual}}', dataAtual);
}

export default function ProcessDetailPage({ store }) {
  const { id } = useParams();
  const {
    processos,
    movimentacoes,
    documentos,
    modelos_documento = [],
    setores,
    usuarios,
    currentUser,
    tramitarProcesso,
    adicionarDocumento,
    assinarDocumento,
  } = store;

  const processo = processos.find((p) => p.id === id);

  const [acao, setAcao] = useState('envio');
  const [destinoSetorId, setDestinoSetorId] = useState(
    setores.find((s) => s.id !== processo?.setor_atual_id)?.id || processo?.setor_atual_id || ''
  );
  const [despacho, setDespacho] = useState('');

  const [modeloSelecionadoId, setModeloSelecionadoId] = useState(modelos_documento[0]?.id || '');
  const [tituloDoc, setTituloDoc] = useState('');
  const [conteudoDoc, setConteudoDoc] = useState('');
  const [solicitarAssinatura, setSolicitarAssinatura] = useState(false);

  if (!processo) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <Link to="/processos" className="text-sm font-medium text-blue-600 hover:underline">
          ← Voltar à lista
        </Link>
        <h2 className="mt-2 text-xl font-bold text-slate-900">Processo não encontrado</h2>
      </div>
    );
  }

  const setorAtual = setores.find((s) => s.id === processo.setor_atual_id);
  const movsDoProcesso = movimentacoes
    .filter((m) => m.processo_id === processo.id)
    .sort((a, b) => new Date(b.criado_em) - new Date(a.criado_em));
  const docsDoProcesso = documentos.filter((d) => d.processo_id === processo.id);

  const handleTramitar = (e) => {
    e.preventDefault();
    const setorFinal =
      acao === 'arquivamento' || acao === 'conclusao' || acao === 'recebimento'
        ? processo.setor_atual_id
        : destinoSetorId;

    tramitarProcesso({
      processo_id: processo.id,
      destino_setor_id: setorFinal,
      acao,
      despacho,
    });
    setDespacho('');
  };

  const handleSelecionarModelo = (modeloId) => {
    setModeloSelecionadoId(modeloId);
    const modelo = modelos_documento.find((m) => m.id === modeloId);
    if (modelo) {
      setTituloDoc(modelo.nome);
      setConteudoDoc(preencherModelo(modelo.corpo_template, processo));
    }
  };

  const handleCriarDocumento = (e) => {
    e.preventDefault();
    if (!tituloDoc.trim() || !conteudoDoc.trim()) return;

    adicionarDocumento({
      processo_id: processo.id,
      tipo: 'minuta_modelo',
      titulo: tituloDoc,
      modelo_id: modeloSelecionadoId || null,
      conteudo_texto: conteudoDoc,
      solicitar_assinatura: solicitarAssinatura,
    });

    setTituloDoc('');
    setConteudoDoc('');
    setSolicitarAssinatura(false);
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none';

  return (
    <div className="space-y-6">
      {/* Cabeçalho do processo */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <Link to="/processos" className="text-sm font-medium text-blue-600 hover:underline">
          ← Voltar à lista
        </Link>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md bg-blue-50 px-2.5 py-1 font-mono text-sm font-bold text-blue-700">
              {processo.numero_protocolo}
            </span>
            <h1 className="text-xl font-bold text-slate-900">{processo.assunto}</h1>
          </div>

          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_BADGE[processo.status] || 'bg-slate-100 text-slate-700'}`}>
            {STATUS_LABEL[processo.status] || processo.status}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <span>Interessado: <strong className="text-slate-900">{processo.interessado_nome}</strong></span>
          <span>Setor atual: <strong className="text-slate-900">{setorAtual?.sigla} - {setorAtual?.nome}</strong></span>
          {processo.prazo_limite && (
            <span>Prazo: <strong className="text-slate-900">{processo.prazo_limite}</strong></span>
          )}
        </div>
      </div>

      {/* Tramitação */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">Tramitar / Atualizar Estado</h2>

        <form onSubmit={handleTramitar} className="max-w-2xl space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Ação</label>
              <select value={acao} onChange={(e) => setAcao(e.target.value)} className={inputClass}>
                <option value="envio">Enviar para outro setor</option>
                <option value="recebimento">Confirmar recebimento no setor atual</option>
                <option value="devolucao">Devolver processo</option>
                <option value="conclusao">Marcar como concluído</option>
                <option value="arquivamento">Arquivar processo</option>
              </select>
            </div>

            {(acao === 'envio' || acao === 'devolucao') && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Setor de destino</label>
                <select
                  value={destinoSetorId}
                  onChange={(e) => setDestinoSetorId(e.target.value)}
                  className={inputClass}
                >
                  {setores.filter((s) => s.ativo).map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.sigla} - {s.nome}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Despacho / Observação</label>
            <textarea
              rows={3}
              value={despacho}
              onChange={(e) => setDespacho(e.target.value)}
              placeholder="Descreva o encaminhamento ou decisão..."
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
          >
            Registrar Movimentação
          </button>
        </form>
      </section>

      {/* Documentos e Assinatura */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">
          Documentos do Processo ({docsDoProcesso.length})
        </h2>

        {docsDoProcesso.length > 0 && (
          <div className="space-y-3">
            {docsDoProcesso.map((doc) => {
              const assinante = usuarios.find((u) => u.id === doc.assinado_por_id);
              return (
                <div
                  key={doc.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-semibold text-slate-900">{doc.titulo}</span>

                    {doc.hash_sha256 ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                        Assinado por <strong>{assinante?.nome || 'Usuário'}</strong> em{' '}
                        {new Date(doc.assinado_em).toLocaleString('pt-BR')}
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => assinarDocumento(doc.id)}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 cursor-pointer"
                      >
                        Assinar como {currentUser.nome}
                      </button>
                    )}
                  </div>

                  {doc.conteudo_texto && (
                    <pre className="whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs text-slate-700">
                      {doc.conteudo_texto}
                    </pre>
                  )}

                  {doc.hash_sha256 && (
                    <div className="break-all text-xs text-slate-500">
                      Hash SHA-256:{' '}
                      <code className="rounded bg-slate-200/70 px-1.5 py-0.5 text-slate-800">
                        {doc.hash_sha256}
                      </code>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="border-t border-slate-200 pt-5">
          <h3 className="mb-3 text-base font-semibold text-slate-900">
            Gerar Documento a partir de Modelo
          </h3>

          <form onSubmit={handleCriarDocumento} className="max-w-2xl space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Modelo padronizado</label>
              <select
                value={modeloSelecionadoId}
                onChange={(e) => handleSelecionarModelo(e.target.value)}
                className={inputClass}
              >
                <option value="">-- Escolha um modelo para preencher --</option>
                {modelos_documento.map((m) => (
                  <option key={m.id} value={m.id}>{m.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Título do documento *</label>
              <input
                type="text"
                required
                value={tituloDoc}
                onChange={(e) => setTituloDoc(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Conteúdo *</label>
              <textarea
                rows={6}
                required
                value={conteudoDoc}
                onChange={(e) => setConteudoDoc(e.target.value)}
                className={inputClass}
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={solicitarAssinatura}
                onChange={(e) => setSolicitarAssinatura(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              Marcar processo como aguardando assinatura
            </label>

            <button
              type="submit"
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 cursor-pointer"
            >
              Incluir Documento no Processo
            </button>
          </form>
        </div>
      </section>

      {/* Histórico de Movimentações */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Histórico de Movimentações ({movsDoProcesso.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {movsDoProcesso.map((mov) => {
            const autor = usuarios.find((u) => u.id === mov.usuario_id);
            const origem = setores.find((s) => s.id === mov.origem_setor_id);
            const destino = setores.find((s) => s.id === mov.destino_setor_id);

            return (
              <div key={mov.id} className="py-3.5 space-y-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                    {mov.acao}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(mov.criado_em).toLocaleString('pt-BR')}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  Responsável: <strong className="text-slate-800">{autor?.nome || 'Sistema'}</strong> • Origem:{' '}
                  <strong className="text-slate-800">{origem?.sigla || '-'}</strong> → Destino:{' '}
                  <strong className="text-slate-800">{destino?.sigla || '-'}</strong>
                </div>

                {mov.despacho && (
                  <p className="pt-1 text-sm text-slate-700">{mov.despacho}</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}