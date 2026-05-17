import {
  StyleSheet, Text, View, Pressable, FlatList, Image,
} from 'react-native';
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

// Imagem com fallback para paths locais antigos (Railway restart)
const ImageComFallback = ({ uri, style }) => {
  const [erro, setErro] = React.useState(false);
  if (!uri || erro) {
    return (
      <View style={[style, { backgroundColor: '#D9D9D9', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#999', fontSize: 11 }}>Sem imagem</Text>
      </View>
    );
  }
  return <Image source={{ uri }} style={style} onError={() => setErro(true)} />;
};

const Header = ({ abrirModal }) => (
  <View style={styles.header}>
    <Pressable style={styles.buttomFilter}>
      <Text style={styles.textFilter}>Filtrar</Text>
    </Pressable>
    <Pressable style={styles.buttomNotificacao} onPress={abrirModal}>
      <MaterialCommunityIcons name="bell-ring-outline" size={24} color="black" />
    </Pressable>
  </View>
);

export default function FeedEmpresa({ navigation }) {
  const [modalVisivel, setModalVisible] = useState(false);
  const [modalAddVisivel, setModalAddVisivel] = useState(false);
  const [modalLogoffVisivel, setModalLogoffVisivel] = useState(false);
  const [listaProdutos, setListaProdutos] = useState([]);

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

  const irParaDetalhes = (produto) => navigation.navigate('DetalhesPost', { produto });

  const renderItem = ({ item }) => {
    const imagemUrl = item.imagem
      ? item.imagem.startsWith('http')
        ? item.imagem
        : `${API_BASE_URL}${item.imagem}`
      : null;

    return (
      <Pressable
        style={[styles.card, item.isPromocao && styles.cardPromocao]}
        onPress={() => irParaDetalhes(item)}>

        <Text style={styles.title}>{item.nome}</Text>

        {/* Imagem com selo da IA sobreposto */}
        <View style={styles.imageWrapper}>
          <ImageComFallback uri={imagemUrl} style={styles.image} />

          {/* Selo gerado pela IA no canto superior direito */}
          {item.isPromocao && item.urlBannerPromocional && (
            <Image
              source={{ uri: item.urlBannerPromocional }}
              style={styles.selo}
              resizeMode="contain"
            />
          )}

          {/* Badge simples quando em promoção mas sem selo da IA */}
          {item.isPromocao && !item.urlBannerPromocional && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.porcentagemDesconto?.toFixed(0)}% OFF
              </Text>
            </View>
          )}
        </View>

        {item.isPromocao ? (
          <View>
            <Text style={styles.precoOriginal}>R$ {item.precoProduto?.toFixed(2)}</Text>
            <Text style={styles.precoPromocional}>R$ {item.precoPromocional?.toFixed(2)}</Text>
          </View>
        ) : (
          <Text style={styles.price}>R$ {item.precoProduto?.toFixed(2)}</Text>
        )}
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
      <TopBar navigation={navigation} onBackPress={() => setModalLogoffVisivel(true)} />
      <View style={{ flex: 1 }}>
        <Header abrirModal={() => setModalVisible(true)} />
        <ModalNotificacao visivel={modalVisivel} fechar={() => setModalVisible(false)} />
        <ModalAddPost visivel={modalAddVisivel} fechar={() => setModalAddVisivel(false)} adicionar={adicionarProduto} />
        <ModalLogoff visivel={modalLogoffVisivel} fechar={() => setModalLogoffVisivel(false)} navigation={navigation} />

        <FlatList
          data={listaProdutos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />

        <Pressable style={styles.buttomAddPost} onPress={() => setModalAddVisivel(true)}>
          <Ionicons name="add" size={30} color="#fff" />
        </Pressable>
      </View>
      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttomFilter: { backgroundColor: '#983CFF', padding: 10, marginTop: 10 },
  textFilter: { color: '#fff', fontWeight: 'bold' },
  buttomNotificacao: { marginLeft: 15, marginTop: 10, marginRight: 20, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },

  card: { flex: 1, backgroundColor: '#fff', margin: 5, borderRadius: 10, padding: 10, elevation: 3 },
  cardPromocao: { borderWidth: 1.5, borderColor: '#983CFF' },
  title: { fontWeight: 'bold', marginBottom: 5, fontSize: 13 },

  // Wrapper necessário para o position: absolute do selo funcionar
  imageWrapper: { position: 'relative', width: '100%', height: 120 },
  image: { width: '100%', height: '100%', borderRadius: 8 },

  // Selo da IA — canto superior direito, levemente saindo do card para destacar
  selo: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 72,
    height: 72,
  },

  // Badge simples (fallback sem selo da IA)
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#983CFF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 11 },

  precoOriginal: { fontSize: 11, color: '#999', textDecorationLine: 'line-through', marginTop: 4 },
  precoPromocional: { fontWeight: 'bold', color: '#983CFF', fontSize: 14 },
  price: { fontWeight: 'bold', color: '#983CFF' },

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