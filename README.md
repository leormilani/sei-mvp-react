# SEI-MVP — Sistema Eletrônico de Informações e Controle de Processos

Aplicação web desenvolvida em **React** e **Vite** inspirada no fluxo de processos administrativos eletrônicos (modelo SEI), com autuação protocolada, tramitação entre setores, motor de documentos dinâmicos, assinatura eletrônica com hash **SHA-256** e trilha de auditoria.
 Como Acessar:  https://sei-mvp-react.vercel.app
 
## Funcionalidades

-## Principais Funcionalidades

- **Painel de Acompanhamento (`/`)**: Indicadores em tempo real filtrados pelo setor do servidor ativo (processos no setor, em tramitação, aguardando assinatura, prazos vencidos/do dia e concluídos/arquivados) + lista de pendências imediatas.
- **Autuação e Consulta (`/processos` e `/processos/novo`)**:
  - Geração automática de protocolo anual sequencial (`AAAA-000000`).
  - Busca instantânea por protocolo, assunto ou interessado e filtro por status.
- **Tramitação e Assinatura Eletrônica (`/processos/:id`)**:
  - Fluxo completo de envio, recebimento, devolução, conclusão e arquivamento entre unidades.
  - Geração de minutas a partir de modelos com interpolação automática de variáveis (`{{numero_protocolo}}`, `{{interessado_nome}}`, `{{interessado_documento}}`, `{{assunto}}`, `{{data_atual}}`).
  - Assinatura eletrônica interna utilizando a **Web Crypto API** nativa do navegador para gerar carimbo de autoria, data/hora e integridade via **SHA-256**.
  - Linha do tempo cronológica e imutável de todas as movimentações.
- **Gestão de Modelos (`/modelos`)**: Criação e categorização de templates reutilizáveis (Ofício, Despacho, Memorando, Parecer, Certidão).
- **Administração de Unidades e Servidores (`/cadastros`)**: Cadastro de setores e usuários vinculados com perfis de acesso (`operador`, `gestor`, `admin`).
- **Relatórios Gerenciais (`/relatorios`)**: Cruzamento por setor e status com exportação direta para **CSV** (compatível com Microsoft Excel, com BOM UTF-8).
- **Simulação Multi-usuário**: Seletor rápido no cabeçalho para alternar entre servidores de diferentes setores e testar o fluxo ponta a ponta, além de botão para restaurar os dados iniciais.

---

## Stack e Decisões Técnicas

- **React 19 + Vite**: Componentização modular e build otimizado.
- **Custom Hook (`useProcessStore`)**: Centralização de toda a regra de negócio (protocolo sequencial, máquina de estados de tramitação, auditoria e persistência) desacoplada da camada visual.
- **React Router DOM**: Navegação SPA com suporte a rotas dinâmicas e configuração de rewrite (`vercel.json`) para deploy em produção.
- **Tailwind CSS v4**: Interface limpa, responsiva e orientada à produtividade administrativa.
- **Web Crypto API (`crypto.subtle.digest`)**: Geração criptográfica de hash SHA-256 no lado do cliente sem dependências externas.
- **LocalStorage**: Persistência automática de estado para demonstração interativa sem necessidade de backend.

---

## Estrutura do Projeto

```text
src/
├── data/
│   └── mockData.js              # Massa inicial de setores, usuários, modelos e processos
├── hooks/
│   └── useProcessStore.js       # Regras de negócio, auditoria, assinatura SHA-256 e estado
├── pages/
│   ├── DashboardPage.jsx        # Indicadores e caixa de entrada do setor
│   ├── ProcessesPage.jsx        # Listagem, busca e filtros
│   ├── NewProcessPage.jsx       # Autuação de novo processo
│   ├── ProcessDetailPage.jsx    # Tramitação, minutas, assinatura e histórico
│   ├── TemplatesPage.jsx        # Cadastro de modelos de documentos
│   ├── AdminUsersSectorsPage.jsx# Gestão de setores e servidores
│   └── ReportsPage.jsx          # Relatórios e exportação CSV
├── App.jsx                      # Layout principal e roteamento
└── main.jsx                     # Ponto de entrada da aplicação

## Como Executar Localmente

# Instalar dependências
npm install

# Iniciar ambiente de desenvolvimento
npm run dev

# Gerar build de produção
npm run build
