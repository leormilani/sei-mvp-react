import { useState } from 'react';

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

export default function ReportsPage({ store }) {
  const { processos, setores, movimentacoes } = store;

  const [setorFiltro, setSetorFiltro] = useState('todos');
  const [statusFiltro, setStatusFiltro] = useState('todos');

  const filtrados = processos.filter((p) => {
    const bateSetor = setorFiltro === 'todos' || p.setor_atual_id === setorFiltro;
    const bateStatus = statusFiltro === 'todos' || p.status === statusFiltro;
    return bateSetor && bateStatus;
  });

  const exportarCSV = () => {
    const cabecalho = ['Protocolo', 'Assunto', 'Interessado', 'Setor Atual', 'Status', 'Prazo', 'Criado Em'];
    const linhas = filtrados.map((p) => {
      const setor = setores.find((s) => s.id === p.setor_atual_id);
      return [
        p.numero_protocolo,
        `"${p.assunto.replaceAll('"', '""')}"`,
        `"${p.interessado_nome.replaceAll('"', '""')}"`,
        setor?.sigla || '',
        p.status,
        p.prazo_limite || '',
        new Date(p.criado_em).toLocaleDateString('pt-BR'),
      ].join(';');
    });

    const csvContent = '\uFEFF' + [cabecalho.join(';'), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio-processos-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Relatórios Gerenciais ({filtrados.length})
          </h1>
          <p className="text-sm text-slate-600">
            Filtre por unidade e status para analisar a produtividade ou exportar para planilha.
          </p>
        </div>

        <button
          type="button"
          onClick={exportarCSV}
          disabled={filtrados.length === 0}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
        >
          Exportar CSV (Excel)
        </button>
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <select
          value={setorFiltro}
          onChange={(e) => setSetorFiltro(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        >
          <option value="todos">Todos os setores</option>
          {setores.map((s) => (
            <option key={s.id} value={s.id}>
              {s.sigla} - {s.nome}
            </option>
          ))}
        </select>

        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
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

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="px-4 py-3">Protocolo</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Interessado</th>
              <th className="px-4 py-3">Setor Atual</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Movimentações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtrados.map((p) => {
              const setor = setores.find((s) => s.id === p.setor_atual_id);
              const qtdMovs = movimentacoes.filter((m) => m.processo_id === p.id).length;

              return (
                <tr key={p.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono text-xs font-bold text-blue-700">
                    {p.numero_protocolo}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-900">{p.assunto}</td>
                  <td className="px-4 py-3 text-slate-600">{p.interessado_nome}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800">
                      {setor?.sigla}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[p.status] || 'bg-slate-100 text-slate-700'}`}>
                      {STATUS_LABEL[p.status] || p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-700">{qtdMovs}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}