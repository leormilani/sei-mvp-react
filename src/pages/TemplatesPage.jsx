import { useState } from 'react';

export default function TemplatesPage({ store }) {
  const { modelos_documento = [], adicionarModelo } = store;

  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('oficio');
  const [corpoTemplate, setCorpoTemplate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nome.trim() || !corpoTemplate.trim()) return;

    adicionarModelo({
      nome,
      categoria,
      corpo_template: corpoTemplate,
    });

    setNome('');
    setCategoria('oficio');
    setCorpoTemplate('');
  };

  const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Modelos de Documentos ({modelos_documento.length})
        </h1>
        <p className="text-sm text-slate-600">
          Cadastre modelos reutilizáveis com preenchimento automático de variáveis do processo.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xs">
        <h2 className="text-lg font-semibold text-slate-900">Cadastrar Novo Modelo</h2>
        <p className="mt-1 text-xs text-slate-500">
          Variáveis disponíveis:{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">{'{{numero_protocolo}}'}</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">{'{{interessado_nome}}'}</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">{'{{interessado_documento}}'}</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">{'{{assunto}}'}</code>,{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5">{'{{data_atual}}'}</code>
        </p>

        <form onSubmit={handleSubmit} className="mt-4 max-w-2xl space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Nome do Modelo *</label>
              <input
                type="text"
                required
                placeholder="Ex: Ofício de Encaminhamento"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Categoria</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className={inputClass}
              >
                <option value="oficio">Ofício</option>
                <option value="despacho">Despacho</option>
                <option value="memorando">Memorando</option>
                <option value="parecer">Parecer</option>
                <option value="certidao">Certidão</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Texto do Modelo *</label>
            <textarea
              rows={6}
              required
              placeholder="Processo nº {{numero_protocolo}}..."
              value={corpoTemplate}
              onChange={(e) => setCorpoTemplate(e.target.value)}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-blue-700 cursor-pointer"
          >
            Salvar Modelo
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Modelos Cadastrados</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modelos_documento.map((mod) => (
            <div key={mod.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <strong className="text-slate-900">{mod.nome}</strong>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                  {mod.categoria}
                </span>
              </div>

              <pre className="whitespace-pre-wrap rounded-lg border border-slate-100 bg-slate-50 p-3 font-mono text-xs text-slate-700">
                {mod.corpo_template}
              </pre>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}