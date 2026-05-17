import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';

// Componente de imagem com fallback para quando a URL quebra (ex: Railway restart)
const ImageComFallback = ({ uri, style }) => {
  const [erro, setErro] = React.useState(false);
  if (!uri || erro) {
    return <View style={[style, { backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center' }]}>
      <Text style={{ color: '#999', fontSize: 11 }}>Sem imagem</Text>
    </View>;
  }
  return <Image source={{ uri }} style={style} onError={() => setErro(true)} />;
};
import { SafeAreaView } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';
import Footer from '../../components/Footer';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ModalNotificacao from '../../components/modals/ModalNotificacao';
import React, { useState, useContext, useEffect } from 'react';
import ModalAddPost from '../../components/modals/ModalAddPost';
import ModalLogoff from '../../components/modals/ModalLogoff';
import { UserContext } from '../../components/UserContext';
import { buscarTodosProdutos } from '../../services/produtoService';
import { API_BASE_URL } from '../../config/api';

//estrutura do header com os botões
const Header = ({ abrirModal }) => (
  <View style={styles.header}>
    <Pressable style={styles.buttomFilter}>
      <Text style={styles.textFilter}>Filtrar</Text>
    </Pressable>

    <Pressable style={styles.buttomNotificacao} onPress={abrirModal}>
      <MaterialCommunityIcons
        name="bell-ring-outline"
        size={24}
        color="black"
        style={styles.imgNotficacao}
      />
    </Pressable>
  </View>
);

export default function FeedEmpresa({ navigation }) {
  const [modalVisivel, setModalVisible] = useState(false);
  const [modalAddVisivel, setModalAddVisivel] = useState(false);
  const [modalLogoffVisivel, setModalLogoffVisivel] = useState(false); // 👈 state do logoff
  const [listaProdutos, setListaProdutos] = useState([]);
  // puxa setPublicacoes do contexto para sincronizar com a TelaPerfil

  const { authToken } = useContext(UserContext);
  const { setPublicacoes } = useContext(UserContext);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await buscarTodosProdutos(authToken);
        setListaProdutos(data);
        setPublicacoes(data);
      } catch (err) {
        console.log('Erro ao carregar produtos', err);
      }
    };
    carregar();
  }, [authToken]);
  // Função para abrir a tela de detalhes
  const irParaDetalhes = (produto) => {
    navigation.navigate('DetalhesPost', { produto });
  };

  //renderizando (carregando) os posts
  const renderItem = ({ item }) => {
    // Suporta URL completa (Cloudinary) e caminho legado (Railway)
    const imagemUrl = item.imagem
      ? item.imagem.startsWith('http')
        ? item.imagem
        : `${API_BASE_URL}${item.imagem}`
      : null;
    return (
      <Pressable style={styles.card} onPress={() => irParaDetalhes(item)}>
        <Text style={styles.title}>{item.nome}</Text>
        <ImageComFallback uri={imagemUrl} style={styles.image} />
        <Text style={styles.price}>R$ {item.precoProduto?.toFixed(2)}</Text>
      </Pressable>
    );
  };

  const adicionarProduto = (novoProduto) => {
    setListaProdutos((prev) => [novoProduto, ...prev]);
    setPublicacoes((prev) => [novoProduto, ...prev]);
    setModalAddVisivel(false);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 👇 onBackPress abre o modal de logoff ao clicar na seta */}
      <TopBar
        navigation={navigation}
        onBackPress={() => setModalLogoffVisivel(true)}
      />

      <View style={{ flex: 1 }}>
        <Header abrirModal={() => setModalVisible(true)} />

        <ModalNotificacao
          visivel={modalVisivel}
          fechar={() => setModalVisible(false)}
        />

        <ModalAddPost
          visivel={modalAddVisivel}
          fechar={() => setModalAddVisivel(false)}
          adicionar={adicionarProduto}
        />

        {/* 👇 Modal de logoff integrado */}
        <ModalLogoff
          visivel={modalLogoffVisivel}
          fechar={() => setModalLogoffVisivel(false)}
          navigation={navigation}
        />

        <FlatList
          data={listaProdutos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <Pressable
          style={styles.buttomAddPost}
          onPress={() => setModalAddVisivel(true)}>
          <Ionicons name="add" size={30} color="#fff" />
        </Pressable>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttomFilter: {
    backgroundColor: '#983CFF',
    padding: 10,
    marginTop: 10,
  },
  textFilter: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttomNotificacao: {
    marginLeft: 15,
    marginTop: 10,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgNotficacao: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#983CFF',
  },
  buttomAddPost: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 55,
    height: 55,
    borderRadius: 30,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});