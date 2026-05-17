import React, { useState, useContext, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Footer from '../../components/Footer';
import TopBar from '../../components/TopBar';
import { UserContext } from '../../components/UserContext';
import ModalOpcoesPost from '../../components/modals/ModalOpcoesPost';
import ModalEditarPerfil from '../../components/modals/ModalEditarPerfil';
import { buscarProdutosEmpresa } from '../../services/produtoService';
import { buscarPerfilEmpresa } from '../../services/empresaService';
import { API_BASE_URL } from '../../config/api';
import { useFocusEffect } from '@react-navigation/native';

const TelaPerfilEmpresa = ({ navigation }) => {
  const [ativo, setAtivo] = useState('publicacoes');
  const { publicacoes, setPublicacoes } = useContext(UserContext);
  const { fotoPerfilEmpresa, setFotoPerfilEmpresa } = useContext(UserContext);
  const { authToken } = useContext(UserContext);
  const {
    nomeLoja,
    setNomeLoja,
    descricaoLoja,
    setDescricaoLoja,
    telefoneLoja,
    setTelefoneLoja,
    fotoFundo,
    setFotoFundo,
    corPerfil,
    setCorPerfil,
  } = useContext(UserContext);

  const [modalEditarPerfil, setModalEditarPerfil] = useState(false);
  const [postSelecionado, setPostSelecionado] = useState(null);
  const [modalOpcoesVisivel, setModalOpcoesVisivel] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const produtos = await buscarProdutosEmpresa(authToken);
          setPublicacoes(produtos);
          if (!fotoPerfilEmpresa) {
            const empresa = await buscarPerfilEmpresa(authToken);
            setNomeLoja(empresa.nome);
            setDescricaoLoja(empresa.descricao);
            setTelefoneLoja(empresa.telefone);
            if (empresa.logoUrl) {
              const foto = empresa.logoUrl.startsWith('http')
                ? empresa.logoUrl
                : `${API_BASE_URL}${empresa.logoUrl}`;
              setFotoPerfilEmpresa(foto);
            }
          }
        } catch (err) {
          console.log(err);
        }
      };
      carregar();
    }, [authToken])
  );

  const abrirOpcoes = (item) => {
    setPostSelecionado(item);
    setModalOpcoesVisivel(true);
  };

  const fecharOpcoes = () => setModalOpcoesVisivel(false);

  const handleSalvarEdicao = async () => {
    const produtos = await buscarProdutosEmpresa(authToken);
    setPublicacoes(produtos);
  };

  const handleSalvarPromocao = (postComPromocao) => {
    setPublicacoes((prev) =>
      prev.map((p) => (p.id === postComPromocao.id ? postComPromocao : p))
    );
  };

  const handleDeletar = async () => {
    const produtos = await buscarProdutosEmpresa(authToken);
    setPublicacoes(produtos);
  };

  const handleSalvarPerfil = (dados) => {
    if (dados.nomeLoja) setNomeLoja(dados.nomeLoja);
    if (dados.descricao) setDescricaoLoja(dados.descricao);
    if (dados.fotoPerfil) setFotoPerfilEmpresa(dados.fotoPerfil);
    if (dados.fotoFundo) setFotoFundo(dados.fotoFundo);
    if (dados.cor) setCorPerfil(dados.cor);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
          <TopBar navigation={navigation} />

          {/* FUNDO DO PERFIL */}
          <View style={[styles.colorone, fotoFundo && { padding: 0 }]}>
            {fotoFundo && (
              <Image
                source={{ uri: fotoFundo }}
                style={styles.fotoFundo}
                resizeMode="cover"
              />
            )}
          </View>

          <View
            style={[
              styles.colortwo,
              corPerfil && { backgroundColor: corPerfil + '33' },
            ]}>
            <View style={styles.texto}>
              <Text style={styles.nome}>{nomeLoja}</Text>
              <Text style={styles.descicao}>{descricaoLoja}</Text>
              <Text style={styles.telefone}>Contato: {telefoneLoja}</Text>
            </View>

            <Pressable
              style={styles.editarPerfilBtn}
              onPress={() => setModalEditarPerfil(true)}>
              <MaterialIcons name="edit" size={20} color="#555" />
            </Pressable>
          </View>

          {/* FOTO DE PERFIL */}
          <View style={styles.profile}>
            {fotoPerfilEmpresa ? (
              <Image
                source={{ uri: fotoPerfilEmpresa }}
                style={{ width: 140, height: 140, borderRadius: 100 }}
              />
            ) : (
              <Text
                style={{ textAlign: 'center', color: 'white', marginTop: 30 }}>
                Nenhuma foto adicionada
              </Text>
            )}
          </View>

          <View style={styles.botoes}>
            <Pressable
              onPress={() => setAtivo('publicacoes')}
              style={[
                styles.botao,
                ativo === 'publicacoes'
                  ? styles.botaoAtivo
                  : styles.botaoInativo,
              ]}>
              <Text style={styles.botaoText}>MINHAS PUBLICAÇÕES</Text>
            </Pressable>
          </View>

          <View style={styles.feed}>
            {publicacoes.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                Nenhuma publicação ainda.
              </Text>
            ) : (
              publicacoes.map((item) => {
                const imagemUrl = item.imagem
                  ? item.imagem.startsWith('http')
                    ? item.imagem
                    : `${API_BASE_URL}${item.imagem}`
                  : null;

                return (
                  <View key={item.id} style={[styles.card, item.isPromocao && styles.cardPromocao]}>
                    <View style={styles.cardHeader}>
                      <View>
                        <Text style={styles.cardTitulo}>{item.nome}</Text>
                        {item.isPromocao ? (
                          <View>
                            <Text style={styles.cardValorOriginal}>R$ {item.precoProduto?.toFixed(2)}</Text>
                            <Text style={styles.cardValor}>R$ {item.precoPromocional?.toFixed(2)}</Text>
                            <Text style={styles.cardDesconto}>{item.porcentagemDesconto?.toFixed(0)}% OFF</Text>
                          </View>
                        ) : (
                          <Text style={styles.cardValor}>R$ {item.precoProduto?.toFixed(2)}</Text>
                        )}
                      </View>
                      <Pressable onPress={() => abrirOpcoes(item)} style={styles.menuButton}>
                        <MaterialIcons name="more-vert" size={22} color="#333" />
                      </Pressable>
                    </View>

                    {imagemUrl ? (
                      <Image source={{ uri: imagemUrl }} style={styles.imagefeed} resizeMode="cover" />
                    ) : (
                      <View style={styles.imagefeed} />
                    )}

                    {item.urlBannerPromocional && (
                      <Image source={{ uri: item.urlBannerPromocional }} style={styles.bannerPromocional} resizeMode="cover" />
                    )}
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>

        <Footer />

        <ModalOpcoesPost
          visivel={modalOpcoesVisivel}
          fechar={fecharOpcoes}
          post={postSelecionado}
          onSalvarEdicao={handleSalvarEdicao}
          onSalvarPromocao={handleSalvarPromocao}
          onConfirmarDeletar={handleDeletar}
        />

        <ModalEditarPerfil
          visivel={modalEditarPerfil}
          fechar={() => setModalEditarPerfil(false)}
          perfil={{
            nomeLoja,
            descricao: descricaoLoja,
            fotoPerfil: fotoPerfilEmpresa,
            fotoFundo,
            cor: corPerfil,
          }}
          onSalvar={handleSalvarPerfil}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 80 },
  colorone: { height: 130, backgroundColor: '#D9D9D9', overflow: 'hidden' },
  fotoFundo: { width: '100%', height: '100%' },
  colortwo: { height: 150, backgroundColor: '#BFBFBF' },
  texto: { alignItems: 'center', paddingTop: 70, marginTop: 15 },
  editarPerfilBtn: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  profile: {
    backgroundColor: '#8C8C8C',
    position: 'absolute',
    top: 99,
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    margin: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  botoes: { flexDirection: 'row', width: '100%', backgroundColor: '#BFBFBF' },
  botao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  botaoAtivo: { backgroundColor: '#D9D9D9' },
  botaoInativo: { backgroundColor: '#BFBFBF' },
  botaoText: { padding: 10 },
  nome: { fontWeight: 'bold' },
  descicao: { fontWeight: 'bold' },

  telefone: {
    padding: 10,
    backgroundColor: '#666666',
    width: '100%',
    textAlign: 'center',
  },

  feed: { marginTop: 25, width: '90%', alignSelf: 'center', paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardTitulo: { fontSize: 14, fontWeight: '600', color: '#222' },
  cardValor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#983CFF',
    marginTop: 2,
  },
  menuButton: { padding: 4 },
  imagefeed: {
    width: '100%',
    height: 180,
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
  },
});

export default TelaPerfilEmpresa;