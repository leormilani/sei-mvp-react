import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useProcessStore } from './hooks/useProcessStore';
import DashboardPage from './pages/DashboardPage';
import ProcessesPage from './pages/ProcessesPage';
import NewProcessPage from './pages/NewProcessPage';
import ProcessDetailPage from './pages/ProcessDetailPage';
import TemplatesPage from './pages/TemplatesPage';
import AdminUsersSectorsPage from './pages/AdminUsersSectorsPage';
import ReportsPage from './pages/ReportsPage';

function NavLinks() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Painel' },
    { to: '/processos', label: 'Processos' },
    { to: '/processos/novo', label: 'Novo Processo' },
    { to: '/modelos', label: 'Modelos' },
    { to: '/cadastros', label: 'Setores e Usuários' },
    { to: '/relatorios', label: 'Relatórios' },
  ];

  return (
    <nav className="flex flex-wrap items-center gap-1.5">
      {links.map((item) => {
        const active =
          item.to === '/' ? pathname === '/' : pathname.startsWith(item.to);

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              active
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function App() {
  const store = useProcessStore();
  const { usuarios, setores, currentUser, setCurrentUserId, resetarDadosDemo } = store;

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700 text-xs font-bold text-white">
                  SEI
                </span>
                <span className="text-base font-bold tracking-tight text-slate-900">
                  Controle de Processos
                </span>
              </div>
              <NavLinks />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={currentUser.id}
                onChange={(e) => setCurrentUserId(e.target.value)}
                aria-label="Usuário ativo"
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-none"
              >
                {usuarios.map((u) => {
                  const setor = setores.find((s) => s.id === u.setor_id);
                  return (
                    <option key={u.id} value={u.id}>
                      {u.nome} ({setor?.sigla})
                    </option>
                  );
                })}
              </select>

              <button
                type="button"
                onClick={resetarDadosDemo}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 cursor-pointer"
              >
                Resetar Demo
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
          <Routes>
            <Route path="/" element={<DashboardPage store={store} />} />
            <Route path="/processos" element={<ProcessesPage store={store} />} />
            <Route path="/processos/novo" element={<NewProcessPage store={store} />} />
            <Route path="/processos/:id" element={<ProcessDetailPage store={store} />} />
            <Route path="/modelos" element={<TemplatesPage store={store} />} />
            <Route path="/cadastros" element={<AdminUsersSectorsPage store={store} />} />
            <Route path="/relatorios" element={<ReportsPage store={store} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}