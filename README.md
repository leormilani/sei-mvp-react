# SEI-MVP — Sistema Eletrônico de Informações e Controle de Processos

Aplicação web desenvolvida em **React** e **Vite** para simulação funcional de gestão de processos administrativos, tramitação entre setores, geração de documentos com modelos, assinatura eletrônica com hash **SHA-256** e trilha de auditoria.

## Funcionalidades

- **Painel de Acompanhamento (`/`)**: Indicadores de processos no setor do usuário ativo, em tramitação, aguardando assinatura, prazos vencidos/do dia e concluídos/arquivados, além da caixa de pendências do setor.
- **Gestão de Processos (`/processos` e `/processos/novo`)**: Autuação com geração automática de protocolo sequencial (`AAAA-000000`), busca textual e filtro por status.
- **Detalhe, Tramitação e Assinatura (`/processos/:id`)**:
  - Envio, recebimento, devolução, conclusão e arquivamento entre setores com registro de despacho.
  - Geração de documentos a partir de modelos padronizados com substituição de variáveis (`{{numero_protocolo}}`, `{{interessado_nome}}`, `{{interessado_documento}}`, `{{assunto}}`, `{{data_atual}}`).
  - Assinatura eletrônica interna gerando carimbo de data/hora, responsável e hash **SHA-256** via Web Crypto API.
  - Histórico cronológico imutável de movimentações.
- **Modelos de Documentos (`/modelos`)**: Cadastro de novos templates reutilizáveis por categoria.
- **Administração (`/cadastros`)**: Cadastro de setores/unidades e usuários/servidores vinculados a setor e perfil.
- **Relatórios (`/relatorios`)**: Filtro por setor e status com exportação em **CSV** compatível com Excel.
- **Simulação Multi-usuário e Reset**: Troca rápida de usuário ativo no topo e botão para restaurar os dados iniciais de demonstração.

## Tecnologias Utilizadas

- **React** + **Vite**
- **React Router DOM** (`react-router-dom`)
- **Tailwind CSS** (`@tailwindcss/vite`)
- **Web Crypto API** (`crypto.subtle.digest` para hash SHA-256)
- **LocalStorage** para persistência local no navegador

## Como Executar Localmente

```bash
npm install
npm run dev