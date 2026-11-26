import { useState } from 'react';
import { Link } from 'react-router-dom';

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

export default function ProcessesPage({ store }) {
  const { processos, setores } = store;
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');

  const processosFiltrados = processos.filter((proc) => {
    const termo = busca.toLowerCase();
    const bateBusca =
      proc.numero_protocolo.toLowerCase().includes(termo) ||
      proc.assunto.toLowerCase().includes(termo) ||
      proc.interessado_nome.toLowerCase().includes(termo);

    const bateStatus = filtroStatus === 'todos' || proc.status === filtroStatus;
    return bateBusca && bateStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Processos Administrativos ({processosFiltrados.length})
          </h1>
          <p className="text-sm text-slate-600">Consulte, filtre e acompanhe a tramitação por setor.</p>
        </div>

        <Link
          to="/processos/novo"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700"
        >
          + Novo Processo (Autuar)
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <input
          type="text"
          placeholder="Buscar por protocolo, assunto ou interessado..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="min-w-[260px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />

        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="todos">Todos os status</option>
          <option value="aberto">Aberto</option>
          <option value="em_tramitacao">Em Tramitação</option>
          <option value="aguardando_assinatura">Aguardando Assinatura</option>
          <option value="concluido">Concluído</option>
          <option value="arquivado">Arquivado</option>
        </select>
      </div>

      {processosFiltrados.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white py-12 text-center text-sm text-slate-500">
          Nenhum processo encontrado com os filtros atuais.
        </div>
      ) : (
        <div className="space-y-3">
          {processosFiltrados.map((proc) => {
            const setorAtual = setores.find((s) => s.id === proc.setor_atual_id);
            return (
              <div
                key={proc.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs transition hover:border-blue-300"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-bold text-blue-700">
                      {proc.numero_protocolo}
                    </span>
                    <h2 className="text-base font-semibold text-slate-900">{proc.assunto}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[proc.status] || 'bg-slate-100 text-slate-700'}`}>
                      {STATUS_LABEL[proc.status] || proc.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span>Interessado: <strong>{proc.interessado_nome}</strong></span>
                    <span>Setor atual: <strong>{setorAtual?.sigla}</strong></span>
                    {proc.prazo_limite && <span>Prazo: <strong>{proc.prazo_limite}</strong></span>}
                  </div>
                </div>

                <Link
                  to={`/processos/${proc.id}`}
                  className="rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
                >
                  Abrir / Tramitar →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}