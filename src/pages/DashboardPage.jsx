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

export default function DashboardPage({ store }) {
  const { processos, setores, currentUser } = store;

  const hoje = new Date().toISOString().split('T')[0];

  const noMeuSetor = processos.filter(
    (p) => p.setor_atual_id === currentUser.setor_id && !['concluido', 'arquivado'].includes(p.status)
  );
  const emTramitacao = processos.filter((p) => p.status === 'em_tramitacao' || p.status === 'aberto');
  const aguardandoAssinatura = processos.filter((p) => p.status === 'aguardando_assinatura');
  const concluidosOuArquivados = processos.filter((p) => ['concluido', 'arquivado'].includes(p.status));
  const comPrazoVencidoOuHoje = processos.filter(
    (p) => p.prazo_limite && p.prazo_limite <= hoje && !['concluido', 'arquivado'].includes(p.status)
  );

  const setorUsuario = setores.find((s) => s.id === currentUser.setor_id);

  const cards = [
    { label: 'No Meu Setor', value: noMeuSetor.length, accent: 'border-l-4 border-l-blue-600' },
    { label: 'Em Tramitação / Abertos', value: emTramitacao.length, accent: 'border-l-4 border-l-amber-500' },
    { label: 'Aguardando Assinatura', value: aguardandoAssinatura.length, accent: 'border-l-4 border-l-purple-600' },
    { label: 'Prazo Vencido / Hoje', value: comPrazoVencidoOuHoje.length, accent: 'border-l-4 border-l-rose-600' },
    { label: 'Concluídos / Arquivados', value: concluidosOuArquivados.length, accent: 'border-l-4 border-l-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Painel de Acompanhamento</h1>
          <p className="text-sm text-slate-600">
            Setor atual: <span className="font-semibold text-slate-800">{setorUsuario?.sigla} - {setorUsuario?.nome}</span>
          </p>
        </div>

        <Link
          to="/processos/novo"
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700"
        >
          + Novo Processo
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-slate-200 bg-white p-4 shadow-2xs ${card.accent}`}
          >
            <div className="text-xs font-medium text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{card.value}</div>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Pendentes no Setor {setorUsuario?.sigla} ({noMeuSetor.length})
          </h2>
          <Link to="/processos" className="text-sm font-medium text-blue-600 hover:underline">
            Ver todos os processos →
          </Link>
        </div>

        {noMeuSetor.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 py-8 text-center text-sm text-slate-500">
            Nenhum processo pendente neste setor.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {noMeuSetor.map((proc) => (
              <li key={proc.id} className="flex flex-wrap items-center justify-between gap-4 py-3.5">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-sm font-bold text-blue-700">{proc.numero_protocolo}</span>
                    <span className="font-medium text-slate-900">{proc.assunto}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_BADGE[proc.status] || 'bg-slate-100 text-slate-700'}`}>
                      {STATUS_LABEL[proc.status] || proc.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Interessado: {proc.interessado_nome}
                    {proc.prazo_limite ? ` • Prazo limite: ${proc.prazo_limite}` : ''}
                  </div>
                </div>

                <Link
                  to={`/processos/${proc.id}`}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Abrir / Tramitar →
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}