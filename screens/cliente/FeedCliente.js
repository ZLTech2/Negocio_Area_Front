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


  const formatarExpiracao = (dataIso) => {
    if (!dataIso) return null;
    const data = new Date(dataIso);
    const agora = new Date();
    const diffMs = data - agora;

    if (diffMs <= 0) return 'Promoção encerrada';

    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutos = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const hora = String(data.getHours()).padStart(2, '0');
    const min = String(data.getMinutes()).padStart(2, '0');

    if (diffHoras < 24) {
      return `Expira em ${diffHoras}h ${diffMinutos}min (${dia}/${mes} às ${hora}:${min})`;
    }
    return `Válido até ${dia}/${mes}/${ano} às ${hora}:${min}`;
  };

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


        <View style={styles.imageWrapper}>
          {imagemUrl ? (
            <Image source={{ uri: imagemUrl }} style={styles.image} resizeMode="cover" />
          ) : (
            <View style={[styles.image, { backgroundColor: '#D9D9D9' }]} />
          )}


          {item.isPromocao && item.urlBannerPromocional && (
            <Image
              source={{ uri: item.urlBannerPromocional }}
              style={styles.selo}
              resizeMode="contain"
            />
          )}


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
            {formatarExpiracao(item.dataFinalPromocao) && (
              <View style={styles.expiracaoContainer}>
                <Text style={[
                  styles.expiracaoText,
                  item.dataFinalPromocao && new Date(item.dataFinalPromocao) - new Date() < 24 * 60 * 60 * 1000
                    ? styles.expiracaoUrgente
                    : null
                ]}>
                  ⏰ {formatarExpiracao(item.dataFinalPromocao)}
                </Text>
              </View>
            )}
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

  imageWrapper: { position: 'relative', width: '100%', height: 120 },
  image: { width: '100%', height: '100%', borderRadius: 8 },

  selo: {
    position: 'absolute',
    top: -12,
    right: -12,
    width: 72,
    height: 72,
  },

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
  expiracaoContainer: { marginTop: 4 },
  expiracaoText: { fontSize: 10, color: '#666', fontStyle: 'italic' },
  expiracaoUrgente: { color: '#E53935', fontWeight: 'bold', fontStyle: 'normal' },
});