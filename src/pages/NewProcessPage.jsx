import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function NewProcessPage({ store }) {
  const { setores, currentUser, criarProcesso } = store;
  const navigate = useNavigate();

  const [assunto, setAssunto] = useState('');
  const [interessadoNome, setInteressadoNome] = useState('');
  const [interessadoDocumento, setInteressadoDocumento] = useState('');
  const [setorDestinoId, setSetorDestinoId] = useState(currentUser.setor_id);
  const [prazoLimite, setPrazoLimite] = useState('');
  const [despachoInicial, setDespachoInicial] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!assunto.trim() || !interessadoNome.trim()) return;

    const novo = criarProcesso({
      assunto,
      interessado_nome: interessadoNome,
      interessado_documento: interessadoDocumento,
      setor_destino_id: setorDestinoId,
      prazo_limite: prazoLimite || null,
      despacho_inicial: despachoInicial,
    });

    navigate(`/processos/${novo.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link to="/processos" className="text-sm font-medium text-blue-600 hover:underline">
          ← Voltar para lista
        </Link>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Autuação de Novo Processo</h1>
        <p className="text-sm text-slate-600">
          O protocolo será gerado automaticamente no padrão anual sequencial.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Assunto do Processo *</label>
          <input
            type="text"
            required
            placeholder="Ex: Solicitação de compra de equipamentos"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Nome do Interessado *</label>
            <input
              type="text"
              required
              value={interessadoNome}
              onChange={(e) => setInteressadoNome(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">CPF / CNPJ do Interessado</label>
            <input
              type="text"
              value={interessadoDocumento}
              onChange={(e) => setInteressadoDocumento(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Setor de Destino Inicial</label>
            <select
              value={setorDestinoId}
              onChange={(e) => setSetorDestinoId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            >
              {setores.filter((s) => s.ativo).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sigla} - {s.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Prazo Limite</label>
            <input
              type="date"
              value={prazoLimite}
              onChange={(e) => setPrazoLimite(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Despacho Inicial / Observação</label>
          <textarea
            rows={4}
            value={despachoInicial}
            onChange={(e) => setDespachoInicial(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
          >
            Gerar Protocolo e Abrir Processo
          </button>
          <Link
            to="/processos"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}