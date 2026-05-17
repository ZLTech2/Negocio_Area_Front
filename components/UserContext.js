import React, { createContext, useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserContext = createContext();

const STORAGE_KEY = '@perfil_empresa';

export const UserProvider = ({ children }) => {
  const [fotoPerfilCliente, setFotoPerfilCliente] = useState(null);
  const [fotoPerfilEmpresa, setFotoPerfilEmpresa] = useState(null);
  const [publicacoes, setPublicacoes] = useState([]);
  const [visitante, setVisitante] = useState(null);

  const [authToken, setAuthToken] = useState(null);
  const [authTipo, setAuthTipo] = useState(null);
  const [authExpiresAt, setAuthExpiresAt] = useState(null);

  const [fotoFundo, setFotoFundoState] = useState(null);
  const [corPerfil, setCorPerfilState] = useState(null);
  const [nomeLoja, setNomeLojaState] = useState('NOME DA LOJA');
  const [descricaoLoja, setDescricaoLojaState] = useState('Descrição sobre a loja');
  const [telefoneLoja, setTelefoneLojaState] = useState('Telefone da loja');
  const [empresaId, setEmpresaId] = useState(null);
  const [perfilCarregado, setPerfilCarregado] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const dados = JSON.parse(json);
          if (dados.fotoPerfilEmpresa) setFotoPerfilEmpresa(dados.fotoPerfilEmpresa);
          if (dados.fotoFundo) setFotoFundoState(dados.fotoFundo);
          if (dados.corPerfil) setCorPerfilState(dados.corPerfil);
          if (dados.nomeLoja) setNomeLojaState(dados.nomeLoja);
          if (dados.descricaoLoja) setDescricaoLojaState(dados.descricaoLoja);
          if (dados.telefoneLoja) setTelefoneLojaState(dados.telefoneLoja);
        }
      } catch (e) {
        console.log('Erro ao carregar perfil do storage:', e);
      } finally {
        setPerfilCarregado(true);
      }
    };
    carregar();
  }, []);

  const salvarStorage = async (patch) => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const atual = json ? JSON.parse(json) : {};
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ ...atual, ...patch }));
    } catch (e) {
      console.log('Erro ao salvar perfil no storage:', e);
    }
  };

  const setFotoFundo = (v) => { setFotoFundoState(v); salvarStorage({ fotoFundo: v }); };
  const setCorPerfil = (v) => { setCorPerfilState(v); salvarStorage({ corPerfil: v }); };
  const setNomeLoja = (v) => { setNomeLojaState(v); salvarStorage({ nomeLoja: v }); };
  const setDescricaoLoja = (v) => { setDescricaoLojaState(v); salvarStorage({ descricaoLoja: v }); };
  const setTelefoneLoja = (v) => { setTelefoneLojaState(v); salvarStorage({ telefoneLoja: v }); };

  const setFotoPerfilEmpresaWrapper = (v) => {
    setFotoPerfilEmpresa(v);
    salvarStorage({ fotoPerfilEmpresa: v });
  };

  const limparPerfilEmpresa = async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setFotoPerfilEmpresa(null);
    setFotoFundoState(null);
    setCorPerfilState(null);
    setNomeLojaState('NOME DA LOJA');
    setDescricaoLojaState('Descrição sobre a loja');
    setTelefoneLojaState('Telefone da loja');
  };

  const fotoPerfil = useMemo(() => {
    if (authTipo === 'empresa') return fotoPerfilEmpresa;
    if (authTipo === 'cliente') return fotoPerfilCliente;
    return fotoPerfilEmpresa || fotoPerfilCliente || null;
  }, [authTipo, fotoPerfilEmpresa, fotoPerfilCliente]);

  const setFotoPerfil = (v) => {
    if (authTipo === 'empresa') {
      setFotoPerfilEmpresaWrapper(v);
    } else {
      setFotoPerfilCliente(v);
    }
  };

  return (
    <UserContext.Provider value={{
      fotoPerfilCliente,
      setFotoPerfilCliente,
      fotoPerfilEmpresa,
      setFotoPerfilEmpresa: setFotoPerfilEmpresaWrapper,
      fotoPerfil,
      setFotoPerfil,
      perfilCarregado,
      publicacoes,
      setPublicacoes,
      visitante,
      setVisitante,
      authToken,
      setAuthToken,
      authTipo,
      setAuthTipo,
      authExpiresAt,
      setAuthExpiresAt,
      fotoFundo,
      setFotoFundo,
      corPerfil,
      setCorPerfil,
      nomeLoja,
      setNomeLoja,
      descricaoLoja,
      setDescricaoLoja,
      telefoneLoja,
      setTelefoneLoja,
      empresaId,
      setEmpresaId,
      limparPerfilEmpresa,
    }}>
      {children}
    </UserContext.Provider>
  );
};