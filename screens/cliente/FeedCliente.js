import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterCliente from '../../components/Footer/FooterCliente';
import TopBar from '../../components/TopBar';
import ModalNotificacao from '../../components/modals/ModalNotificacao';
import { buscarTodosProdutos } from '../../services/produtoService';
import { API_BASE_URL } from '../../config/api';
import ModalLogoff from '../../components/modals/ModalLogoff';

const Header = ({ abrirModal }) => (
  <View style={styles.header}>
    <Pressable style={styles.buttomFilter}>
      <Text style={styles.textFilter}>Filtrar</Text>
    </Pressable>
    <Pressable style={styles.buttomNotificacao} onPress={abrirModal}>
      <Image
        source={require('../../assets/images/img_buttom_notificacao.png')}
        style={styles.imgNotficacao}
      />
    </Pressable>
  </View>
);

export default function FeedCliente({ navigation }) {
  const [modalVisivel, setModalVisible] = useState(false);
  const [listaProdutos, setListaProdutos] = useState([]);
  const [modalLogoffVisivel, setModalLogoffVisivel] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await buscarTodosProdutos();
        setListaProdutos(data);
      } catch (err) {
        console.log('Erro ao carregar produtos:', err);
      }
    };
    carregar();
  }, []);

  const renderItem = ({ item }) => {
    const imagemUrl = item.imagem
      ? item.imagem.startsWith('http')
        ? item.imagem
        : `${API_BASE_URL}${item.imagem}`
      : null;

    return (
      <Pressable
        style={[styles.card, item.isPromocao && styles.cardPromocao]}
        onPress={() => navigation.navigate('DetalhesPost', { produto: item })}>

        <View style={styles.empresaHeader}>
          <Text style={styles.nomeEmpresa}>LOJA: {item.nomeEmpresa}</Text>
        </View>
        <Text style={styles.title}>Produto: {item.nome}</Text>

        {/* Imagem com selo da IA sobreposto */}
        <View style={styles.imageWrapper}>
          {imagemUrl ? (
            <Image source={{ uri: imagemUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { backgroundColor: '#D9D9D9' }]} />
          )}

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

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} onBackPress={() => setModalLogoffVisivel(true)} />
      <View style={styles.container}>
        <Header abrirModal={() => setModalVisible(true)} />
        <ModalNotificacao
          visivel={modalVisivel}
          fechar={(dados) => { setModalVisible(false); if (dados) console.log('Dados recebidos:', dados); }}
        />
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
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>
      <FooterCliente />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  buttomFilter: { backgroundColor: '#983CFF', padding: 10, marginTop: 10 },
  textFilter: { color: '#fff', fontWeight: 'bold' },
  buttomNotificacao: { marginLeft: 15, marginTop: 10, marginRight: 20 },
  imgNotficacao: { width: 30, height: 30 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 },

  card: { flex: 1, backgroundColor: '#fff', margin: 5, borderRadius: 10, padding: 10, elevation: 3 },
  cardPromocao: { borderWidth: 1.5, borderColor: '#983CFF' },
  empresaHeader: { marginBottom: 4 },
  nomeEmpresa: { fontSize: 12, color: '#983CFF', fontWeight: 'bold' },
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
  price: { fontWeight: 'bold', color: '#983CFF', marginTop: 4 },
});