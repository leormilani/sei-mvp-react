import { useState, useEffect, useCallback } from 'react';
import { initialData } from '../data/mockData';

const STORAGE_KEY = 'sei_mvp_store_v1';
const CURRENT_USER_KEY = 'sei_mvp_current_user_v1';

// Gera hash SHA-256 real via Web Crypto API (nativo do navegador)
async function generateSHA256(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Gera protocolo sequencial no padrão AAAA-000000
function generateNextProtocol(processos) {
  const year = new Date().getFullYear();
  const prefix = `${year}-`;
  const currentYearNumbers = processos
    .filter((p) => p.numero_protocolo.startsWith(prefix))
    .map((p) => parseInt(p.numero_protocolo.replace(prefix, ''), 10) || 0);

  const nextSeq = (currentYearNumbers.length ? Math.max(...currentYearNumbers) : 0) + 1;
  return `${prefix}${String(nextSeq).padStart(6, '0')}`;
}

export function useProcessStore() {
  const [store, setStore] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialData;
    } catch {
      return initialData;
    }
  });

  const [currentUserId, setCurrentUserId] = useState(() => {
    return localStorage.getItem(CURRENT_USER_KEY) || initialData.usuarios[0].id;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  useEffect(() => {
    localStorage.setItem(CURRENT_USER_KEY, currentUserId);
  }, [currentUserId]);

  const currentUser =
    store.usuarios.find((u) => u.id === currentUserId) || store.usuarios[0];

  // 1. Abrir / Autuar novo processo
  const criarProcesso = useCallback(
    ({ assunto, interessado_nome, interessado_documento, setor_destino_id, prazo_limite, despacho_inicial }) => {
      const now = new Date().toISOString();
      const processoId = `proc-${Date.now()}`;
      const setorDestino = setor_destino_id || currentUser.setor_id;
      const numero_protocolo = generateNextProtocol(store.processos);

      const novoProcesso = {
        id: processoId,
        numero_protocolo,
        assunto,
        interessado_nome,
        interessado_documento: interessado_documento || '',
        status: setorDestino === currentUser.setor_id ? 'aberto' : 'em_tramitacao',
        setor_atual_id: setorDestino,
        responsavel_id: currentUser.id,
        prazo_limite: prazo_limite || null,
        criado_em: now,
        atualizado_em: now,
      };

      const novaMovimentacao = {
        id: `mov-${Date.now()}`,
        processo_id: processoId,
        origem_setor_id: currentUser.setor_id,
        destino_setor_id: setorDestino,
        usuario_id: currentUser.id,
        acao: 'abertura',
        despacho: despacho_inicial || 'Autuação inicial do processo administrativo.',
        criado_em: now,
      };

      setStore((prev) => ({
        ...prev,
        processos: [novoProcesso, ...prev.processos],
        movimentacoes: [...prev.movimentacoes, novaMovimentacao],
      }));

      return novoProcesso;
    },
    [currentUser, store.processos]
  );

  // 2. Tramitar processo (enviar, receber, devolver, concluir ou arquivar)
  const tramitarProcesso = useCallback(
    ({ processo_id, destino_setor_id, acao, despacho, novo_status }) => {
      const now = new Date().toISOString();

      setStore((prev) => {
        const processoAlvo = prev.processos.find((p) => p.id === processo_id);
        if (!processoAlvo) return prev;

        const setorDestinoFinal = destino_setor_id || processoAlvo.setor_atual_id;

        const statusMap = {
          envio: 'em_tramitacao',
          devolucao: 'em_tramitacao',
          recebimento: 'em_tramitacao',
          arquivamento: 'arquivado',
          conclusao: 'concluido',
        };

        const statusCalculado = novo_status || statusMap[acao] || processoAlvo.status;

        const novaMov = {
          id: `mov-${Date.now()}`,
          processo_id,
          origem_setor_id: processoAlvo.setor_atual_id,
          destino_setor_id: setorDestinoFinal,
          usuario_id: currentUser.id,
          acao,
          despacho: despacho || `Movimentação registrada: ${acao}.`,
          criado_em: now,
        };

        return {
          ...prev,
          processos: prev.processos.map((p) =>
            p.id === processo_id
              ? {
                  ...p,
                  setor_atual_id: setorDestinoFinal,
                  status: statusCalculado,
                  atualizado_em: now,
                }
              : p
          ),
          movimentacoes: [...prev.movimentacoes, novaMov],
        };
      });
    },
    [currentUser]
  );

  // 3. Criar documento a partir de modelo ou anexar arquivo
  const adicionarDocumento = useCallback(
    ({ processo_id, tipo, titulo, modelo_id = null, conteudo_texto = '', arquivo_nome = null, arquivo_url = null, solicitar_assinatura = false }) => {
      const now = new Date().toISOString();

      const novoDoc = {
        id: `doc-${Date.now()}`,
        processo_id,
        tipo,
        titulo,
        modelo_id,
        conteudo_texto,
        arquivo_nome,
        arquivo_url,
        hash_sha256: null,
        assinado_por_id: null,
        assinado_em: null,
        criado_por_id: currentUser.id,
        criado_em: now,
      };

      setStore((prev) => {
        const processoAlvo = prev.processos.find((p) => p.id === processo_id);
        if (!processoAlvo) return prev;

        const novaMov = {
          id: `mov-${Date.now() + 1}`,
          processo_id,
          origem_setor_id: processoAlvo.setor_atual_id,
          destino_setor_id: processoAlvo.setor_atual_id,
          usuario_id: currentUser.id,
          acao: 'inclusao_documento',
          despacho: `Documento incluído: "${titulo}".`,
          criado_em: now,
        };

        return {
          ...prev,
          documentos: [...prev.documentos, novoDoc],
          processos: prev.processos.map((p) =>
            p.id === processo_id
              ? {
                  ...p,
                  status: solicitar_assinatura ? 'aguardando_assinatura' : p.status,
                  atualizado_em: now,
                }
              : p
          ),
          movimentacoes: [...prev.movimentacoes, novaMov],
        };
      });

      return novoDoc;
    },
    [currentUser]
  );

  // 4. Assinatura eletrônica interna com carimbo e hash SHA-256
  const assinarDocumento = useCallback(
    async (documento_id) => {
      const doc = store.documentos.find((d) => d.id === documento_id);
      if (!doc) return null;

      const now = new Date().toISOString();
      const payloadAssinatura = `${doc.id}|${doc.processo_id}|${doc.titulo}|${doc.conteudo_texto || doc.arquivo_nome}|${currentUser.id}|${now}`;
      const hash = await generateSHA256(payloadAssinatura);

      setStore((prev) => {
        const processoAlvo = prev.processos.find((p) => p.id === doc.processo_id);

        const novaMov = {
          id: `mov-${Date.now()}`,
          processo_id: doc.processo_id,
          origem_setor_id: processoAlvo?.setor_atual_id || currentUser.setor_id,
          destino_setor_id: processoAlvo?.setor_atual_id || currentUser.setor_id,
          usuario_id: currentUser.id,
          acao: 'assinatura',
          despacho: `Documento "${doc.titulo}" assinado eletronicamente por ${currentUser.nome}. Hash: ${hash.slice(0, 16)}...`,
          criado_em: now,
        };

        return {
          ...prev,
          documentos: prev.documentos.map((d) =>
            d.id === documento_id
              ? {
                  ...d,
                  hash_sha256: hash,
                  assinado_por_id: currentUser.id,
                  assinado_em: now,
                }
              : d
          ),
          processos: prev.processos.map((p) =>
            p.id === doc.processo_id
              ? {
                  ...p,
                  status: p.status === 'aguardando_assinatura' ? 'em_tramitacao' : p.status,
                  atualizado_em: now,
                }
              : p
          ),
          movimentacoes: [...prev.movimentacoes, novaMov],
        };
      });

      return hash;
    },
    [currentUser, store.documentos]
  );

  // 5. Cadastrar novo setor
  const adicionarSetor = useCallback(({ nome, sigla }) => {
    const novoSetor = {
      id: `set-${Date.now()}`,
      nome,
      sigla: sigla.toUpperCase(),
      ativo: true,
    };
    setStore((prev) => ({
      ...prev,
      setores: [...prev.setores, novoSetor],
    }));
    return novoSetor;
  }, []);

  // 6. Cadastrar novo usuário/servidor
  const adicionarUsuario = useCallback(({ nome, email, cargo, setor_id, perfil }) => {
    const novoUsuario = {
      id: `usr-${Date.now()}`,
      nome,
      email,
      cargo: cargo || 'Servidor',
      setor_id,
      perfil: perfil || 'operador',
      ativo: true,
    };
    setStore((prev) => ({
      ...prev,
      usuarios: [...prev.usuarios, novoUsuario],
    }));
    return novoUsuario;
  }, []);

  // 7. Cadastrar novo modelo oficial de documento
  const adicionarModelo = useCallback(({ nome, categoria, corpo_template }) => {
    const novoModelo = {
      id: `mod-${Date.now()}`,
      nome,
      categoria: categoria || 'oficio',
      corpo_template,
    };
    setStore((prev) => ({
      ...prev,
      modelos_documento: [...prev.modelos_documento, novoModelo],
    }));
    return novoModelo;
  }, []);

  // 8. Resetar dados para o estado inicial de demonstração
  const resetarDadosDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setStore(initialData);
    setCurrentUserId(initialData.usuarios[0].id);
  }, []);

  return {
    ...store,
    currentUser,
    setCurrentUserId,
    criarProcesso,
    tramitarProcesso,
    adicionarDocumento,
    assinarDocumento,
    adicionarSetor,
    adicionarUsuario,
    adicionarModelo,
    resetarDadosDemo,
  };
}