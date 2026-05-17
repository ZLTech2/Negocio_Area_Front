import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FooterCliente from '../../components/Footer/FooterCliente';
import TopBar from '../../components/TopBar';
import { buscarTodosProdutos } from '../../services/produtoService';
import { API_BASE_URL } from '../../config/api';

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

export default function TelaVisitante({ navigation }) {
  const [listaProdutos, setListaProdutos] = useState([]);

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
    const imagemUrl = item.imagem ? `${API_BASE_URL}${item.imagem}` : null;

    return (
      <Pressable style={styles.card} onPress={() => navigation.navigate('DetalhesPost', { produto: item })}>
        <View style={styles.empresaHeader}>
          <Text style={styles.nomeEmpresa}>LOJA: {item.nomeEmpresa}</Text>
        </View>
        <Text style={styles.title}>Produto: {item.nome}</Text>
        {imagemUrl ? (
          <Image source={{ uri: imagemUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, { backgroundColor: '#D9D9D9' }]} />
        )}
        <Text style={styles.price}>R$ {item.precoProduto?.toFixed(2)}</Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} onBackPress={() => setModalLogoffVisivel(true)} />

      <View style={styles.container}>
        <Header abrirModal={() => setModalVisible(true)} />

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
  buttomFilter: {
    backgroundColor: '#983CFF',
    padding: 10,
    marginTop: 10,
  },
  textFilter: { color: '#fff', fontWeight: 'bold' },
  buttomNotificacao: { marginLeft: 15, marginTop: 10, marginRight: 20 },
  imgNotficacao: { width: 30, height: 30 },
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
  empresaHeader: {
    marginBottom: 4,
  },
  nomeEmpresa: {
    fontSize: 16,
    color: '#983CFF',
    fontWeight: 'bold',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 14,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  price: {
    fontWeight: 'bold',
    color: '#983CFF',
    marginTop: 4,
  },
});