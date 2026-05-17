import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { buscarProdutosPorEmpresa } from '../../services/produtoService';
import { API_BASE_URL } from '../../config/api';
import Footer from '../../components/Footer';

export default function TelaProdutosEmpresa({ navigation, route }) {
  const empresaId = route.params?.empresaId;
  const nomeEmpresa = route.params?.nomeEmpresa;
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const data = await buscarProdutosPorEmpresa(empresaId);
          setProdutos(data);
        } catch (err) {
          console.log('Erro ao carregar produtos da empresa:', err);
        } finally {
          setCarregando(false);
        }
      };
      carregar();
    }, [empresaId])
  );

  const filtrados = produtos.filter((p) =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.nomeEmpresa} numberOfLines={1}>
            {nomeEmpresa || 'Produtos'}
          </Text>
        </View>

        {/* BARRA DE BUSCA */}
        <View style={styles.barraBusca}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.inputBusca}
            placeholder="Buscar produto..."
            placeholderTextColor="#999"
            value={busca}
            onChangeText={setBusca}
          />
        </View>

        {/* CONTEÚDO */}
        <View style={{ flex: 1 }}>
          {carregando ? (
            <ActivityIndicator
              size="large"
              color="#983CFF"
              style={{ marginTop: 40 }}
            />
          ) : (
            <FlatList
              data={filtrados}
              keyExtractor={(item) => String(item.id)}
              numColumns={2}
              columnWrapperStyle={styles.coluna}
              contentContainerStyle={styles.lista}
              ListEmptyComponent={
                <Text style={styles.vazio}>Nenhum produto encontrado.</Text>
              }
              renderItem={({ item }) => {
                const imagemUrl = item.imagem
                  ? item.imagem.startsWith('http')
                    ? item.imagem
                    : `${API_BASE_URL}${item.imagem}`
                  : null;
                return (
                  <TouchableOpacity
                    style={styles.card}
                    onPress={() =>
                      navigation.navigate('DetalhesPost', { produto: item })
                    }>
                    {imagemUrl ? (
                      <Image
                        source={{ uri: imagemUrl }}
                        style={styles.imagem}
                      />
                    ) : (
                      <View style={[styles.imagem, styles.imagemPlaceholder]} />
                    )}
                    <Text style={styles.nomeProduto} numberOfLines={2}>
                      {item.nome}
                    </Text>
                    <Text style={styles.preco}>
                      R$ {item.precoProduto?.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#983CFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  backButton: {
    padding: 2,
  },
  nomeEmpresa: {
    flex: 1,
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  barraBusca: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 15,
    marginVertical: 12,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  inputBusca: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  lista: {
    paddingHorizontal: 10,
    paddingBottom: 80,
  },
  coluna: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  imagem: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  imagemPlaceholder: {
    backgroundColor: '#D9D9D9',
  },
  nomeProduto: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#111',
    marginBottom: 4,
  },
  preco: {
    fontWeight: 'bold',
    color: '#983CFF',
    fontSize: 13,
  },
  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});
