export const initialData = {
  setores: [
    { id: 'set-1', nome: 'Protocolo Geral e Arquivo', sigla: 'PGA', ativo: true },
    { id: 'set-2', nome: 'Assessoria Jurídica', sigla: 'ASJUR', ativo: true },
    { id: 'set-3', nome: 'Departamento Financeiro e Compras', sigla: 'DFC', ativo: true },
    { id: 'set-4', nome: 'Diretoria Administrativa', sigla: 'DIRAD', ativo: true },
  ],

  usuarios: [
    {
      id: 'usr-1',
      nome: 'Mariana Costa',
      email: 'mariana.costa@instituicao.gov.br',
      cargo: 'Agente Administrativo',
      setor_id: 'set-1',
      perfil: 'operador',
      ativo: true,
    },
    {
      id: 'usr-2',
      nome: 'Dr. Ricardo Mendes',
      email: 'ricardo.mendes@instituicao.gov.br',
      cargo: 'Procurador Jurídico',
      setor_id: 'set-2',
      perfil: 'gestor',
      ativo: true,
    },
    {
      id: 'usr-3',
      nome: 'Carlos Eduardo Lima',
      email: 'carlos.lima@instituicao.gov.br',
      cargo: 'Analista Financeiro',
      setor_id: 'set-3',
      perfil: 'operador',
      ativo: true,
    },
    {
      id: 'usr-4',
      nome: 'Helena Vasconcelos',
      email: 'helena.dir@instituicao.gov.br',
      cargo: 'Diretora Administrativa',
      setor_id: 'set-4',
      perfil: 'admin',
      ativo: true,
    },
  ],

  modelos_documento: [
    {
      id: 'mod-1',
      nome: 'Despacho de Encaminhamento',
      categoria: 'despacho',
      corpo_template: `DESPACHO ADMINISTRATIVO

Processo nº: {{numero_protocolo}}
Interessado: {{interessado_nome}}
Assunto: {{assunto}}

Encaminho os presentes autos ao setor competente para análise técnica, manifestação e demais providências cabíveis dentro do prazo estipulado.

Em {{data_atual}}.`,
    },
    {
      id: 'mod-2',
      nome: 'Parecer Técnico / Jurídico',
      categoria: 'oficio',
      corpo_template: `PARECER TÉCNICO PRELIMINAR

Referência: Processo Administrativo nº {{numero_protocolo}}
Interessado: {{interessado_nome}} ({{interessado_documento}})

1. RELATÓRIO
Trata-se de solicitação referente a "{{assunto}}".

2. ANÁLISE E CONCLUSÃO
Após verificação documental, opina-se pelo prosseguimento regular do feito, submetendo-se à consideração superior.

Data: {{data_atual}}.`,
    },
    {
      id: 'mod-3',
      nome: 'Termo de Encerramento e Arquivamento',
      categoria: 'declaracao',
      corpo_template: `TERMO DE ENCERRAMENTO E ARQUIVAMENTO

Certifico que o Processo nº {{numero_protocolo}}, de interesse de {{interessado_nome}}, teve todas as suas etapas administrativas devidamente cumpridas, determinando-se o seu arquivamento digital nesta data ({{data_atual}}).`,
    },
  ],

  processos: [
    {
      id: 'proc-1',
      numero_protocolo: '2026-000001',
      assunto: 'Aquisição de equipamentos de informática para laboratório',
      interessado_nome: 'Coordenação de TI',
      interessado_documento: '00.123.456/0001-89',
      status: 'em_tramitacao', // rascunho | aberto | em_tramitacao | aguardando_assinatura | concluido | arquivado
      setor_atual_id: 'set-2',
      responsavel_id: 'usr-2',
      prazo_limite: '2026-12-05',
      criado_em: '2026-11-20T09:15:00.000Z',
      atualizado_em: '2026-11-21T14:30:00.000Z',
    },
    {
      id: 'proc-2',
      numero_protocolo: '2026-000002',
      assunto: 'Solicitação de reequilíbrio econômico-financeiro - Contrato 14/2025',
      interessado_nome: 'Construtora Horizonte Ltda',
      interessado_documento: '12.987.654/0001-10',
      status: 'aguardando_assinatura',
      setor_atual_id: 'set-4',
      responsavel_id: 'usr-4',
      prazo_limite: '2026-11-28',
      criado_em: '2026-11-18T11:00:00.000Z',
      atualizado_em: '2026-11-23T10:10:00.000Z',
    },
  ],

  movimentacoes: [
    {
      id: 'mov-1',
      processo_id: 'proc-1',
      origem_setor_id: 'set-1',
      destino_setor_id: 'set-1',
      usuario_id: 'usr-1',
      acao: 'abertura',
      despacho: 'Autuação inicial do processo administrativo conforme memorando interno.',
      criado_em: '2026-11-20T09:15:00.000Z',
    },
    {
      id: 'mov-2',
      processo_id: 'proc-1',
      origem_setor_id: 'set-1',
      destino_setor_id: 'set-2',
      usuario_id: 'usr-1',
      acao: 'envio',
      despacho: 'Encaminhado à Assessoria Jurídica para análise de conformidade do termo de referência.',
      criado_em: '2026-11-21T14:30:00.000Z',
    },
    {
      id: 'mov-3',
      processo_id: 'proc-2',
      origem_setor_id: 'set-1',
      destino_setor_id: 'set-3',
      usuario_id: 'usr-1',
      acao: 'abertura',
      despacho: 'Processo autuado e enviado ao Financeiro para conferência de planilhas.',
      criado_em: '2026-11-18T11:00:00.000Z',
    },
    {
      id: 'mov-4',
      processo_id: 'proc-2',
      origem_setor_id: 'set-3',
      destino_setor_id: 'set-4',
      usuario_id: 'usr-3',
      acao: 'envio',
      despacho: 'Cálculos conferidos. Encaminhado à Diretoria Administrativa para assinatura do despacho decisório.',
      criado_em: '2026-11-23T10:10:00.000Z',
    },
  ],

  documentos: [
    {
      id: 'doc-1',
      processo_id: 'proc-1',
      tipo: 'minuta_modelo',
      titulo: 'Despacho de Encaminhamento Inicial',
      modelo_id: 'mod-1',
      conteudo_texto:
        'DESPACHO ADMINISTRATIVO\n\nProcesso nº: 2026-000001\nInteressado: Coordenação de TI\nAssunto: Aquisição de equipamentos de informática para laboratório\n\nEncaminho os presentes autos ao setor competente para análise técnica.',
      arquivo_nome: null,
      arquivo_url: null,
      hash_sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
      assinado_por_id: 'usr-1',
      assinado_em: '2026-11-21T14:28:00.000Z',
      criado_por_id: 'usr-1',
      criado_em: '2026-11-21T14:25:00.000Z',
    },
    {
      id: 'doc-2',
      processo_id: 'proc-2',
      tipo: 'minuta_modelo',
      titulo: 'Parecer Técnico - Reequilíbrio Contrato 14/2025',
      modelo_id: 'mod-2',
      conteudo_texto:
        'PARECER TÉCNICO PRELIMINAR\n\nReferência: Processo Administrativo nº 2026-000002\nInteressado: Construtora Horizonte Ltda (12.987.654/0001-10)\n\nApós verificação documental, opina-se pelo prosseguimento regular do feito.',
      arquivo_nome: null,
      arquivo_url: null,
      hash_sha256: null,
      assinado_por_id: null,
      assinado_em: null,
      criado_por_id: 'usr-3',
      criado_em: '2026-11-23T10:05:00.000Z',
    },
  ],
};
