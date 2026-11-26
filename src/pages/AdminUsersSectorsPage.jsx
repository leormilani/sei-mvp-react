import { useState } from 'react';

export default function AdminUsersSectorsPage({ store }) {
  const { setores, usuarios, adicionarSetor, adicionarUsuario } = store;

  const [nomeSetor, setNomeSetor] = useState('');
  const [siglaSetor, setSiglaSetor] = useState('');

  const [nomeUsuario, setNomeUsuario] = useState('');
  const [emailUsuario, setEmailUsuario] = useState('');
  const [cargoUsuario, setCargoUsuario] = useState('');
  const [setorUsuarioId, setSetorUsuarioId] = useState(setores[0]?.id || '');
  const [perfilUsuario, setPerfilUsuario] = useState('operador');

  const handleAddSetor = (e) => {
    e.preventDefault();
    if (!nomeSetor.trim() || !siglaSetor.trim()) return;
    adicionarSetor({ nome: nomeSetor, sigla: siglaSetor });
    setNomeSetor('');
    setSiglaSetor('');
  };

  const handleAddUsuario = (e) => {
    e.preventDefault();
    if (!nomeUsuario.trim() || !emailUsuario.trim()) return;
    adicionarUsuario({
      nome: nomeUsuario,
      email: emailUsuario,
      cargo: cargoUsuario,
      setor_id: setorUsuarioId,
      perfil: perfilUsuario,
    });
    setNomeUsuario('');
    setEmailUsuario('');
    setCargoUsuario('');
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administração: Setores e Usuários</h1>
        <p className="text-sm text-slate-600">
          Gerencie as unidades organizacionais e os servidores vinculados para tramitação e assinatura.
        </p>
      </div>

      {/* Setores */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Setores / Unidades ({setores.length})</h2>

        <form onSubmit={handleAddSetor} className="flex flex-wrap gap-3">
          <input
            type="text"
            required
            placeholder="Nome do setor"
            value={nomeSetor}
            onChange={(e) => setNomeSetor(e.target.value)}
            className="min-w-[240px] flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          <input
            type="text"
            required
            placeholder="Sigla (ex: RH)"
            value={siglaSetor}
            onChange={(e) => setSiglaSetor(e.target.value)}
            className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-sm uppercase focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
          >
            + Adicionar Setor
          </button>
        </form>

        <div className="divide-y divide-slate-100 border-t border-slate-100">
          {setores.map((s) => (
            <div key={s.id} className="flex items-center gap-3 py-2.5 text-sm">
              <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-bold text-slate-800">
                {s.sigla}
              </span>
              <span className="text-slate-700">{s.nome}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Usuários */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Usuários / Servidores ({usuarios.length})</h2>

        <form onSubmit={handleAddUsuario} className="max-w-2xl space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              required
              placeholder="Nome completo *"
              value={nomeUsuario}
              onChange={(e) => setNomeUsuario(e.target.value)}
              className={inputClass}
            />
            <input
              type="email"
              required
              placeholder="E-mail institucional *"
              value={emailUsuario}
              onChange={(e) => setEmailUsuario(e.target.value)}
              className={inputClass}
            />
          </div>

          <input
            type="text"
            placeholder="Cargo (ex: Analista Administrativo)"
            value={cargoUsuario}
            onChange={(e) => setCargoUsuario(e.target.value)}
            className={inputClass}
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <select
              value={setorUsuarioId}
              onChange={(e) => setSetorUsuarioId(e.target.value)}
              className={inputClass}
            >
              {setores.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.sigla} - {s.nome}
                </option>
              ))}
            </select>

            <select
              value={perfilUsuario}
              onChange={(e) => setPerfilUsuario(e.target.value)}
              className={inputClass}
            >
              <option value="operador">Operador</option>
              <option value="gestor">Gestor</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
          >
            + Cadastrar Usuário
          </button>
        </form>

        <div className="divide-y divide-slate-100 border-t border-slate-100 pt-2">
          {usuarios.map((u) => {
            const setor = setores.find((s) => s.id === u.setor_id);
            return (
              <div key={u.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <div>
                  <strong className="text-slate-900">{u.nome}</strong>{' '}
                  <span className="text-slate-500">({u.email})</span>
                  <div className="text-xs text-slate-600">{u.cargo}</div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                    {setor?.sigla}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-700">
                    {u.perfil}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}