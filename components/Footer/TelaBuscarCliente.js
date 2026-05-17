import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../../components/Footer/FooterCliente';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { buscarTodasEmpresas } from '../../services/empresaService';
import { API_BASE_URL } from '../../config/api';

export default function TelaBuscarCliente({ navigation }) {
  const [search, setSearch] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await buscarTodasEmpresas();
        setEmpresas(data);
      } catch (err) {
        console.log('Erro ao buscar empresas:', err);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const filtered = empresas.filter((e) =>
    (e.nomeEmpresa || e.nome || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* HEADER ROXO com seta + campo de busca integrado */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar lojas"
            placeholderTextColor="#bbb"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={{ flex: 1 }}>
          {carregando ? (
            <ActivityIndicator
              size="large"
              color="#983CFF"
              style={{ marginTop: 40 }}
            />
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(item) => String(item.id)}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                <Text style={styles.vazio}>Nenhuma empresa encontrada.</Text>
              }
              renderItem={({ item }) => {
                const fotoUri = item.logoUrl
  ? item.logoUrl.startsWith('http')
    ? item.logoUrl
    : `${API_BASE_URL}${item.logoUrl}`
  : null;
                return (
                  <TouchableOpacity
                    style={styles.storeBox}
                    onPress={() =>
                      navigation.navigate('TelaProdutosEmpresa', {
                        empresaId: item.id,
                        nomeEmpresa: item.nomeEmpresa,
                      })
                    }>
                    {fotoUri ? (
                      <Image
                        source={{ uri: fotoUri }}
                        style={styles.storeImage}
                      />
                    ) : (
                      <View
                        style={[
                          styles.storeImage,
                          styles.storeImagePlaceholder,
                        ]}
                      />
                    )}

                    <View style={styles.storeInfo}>
                      <Text style={styles.storeName}>
                        {item.nomeEmpresa || item.nome}
                      </Text>
                      <Text style={styles.storeDesc}>
                        {item.descricao || 'Empresa cadastrada'}
                      </Text>
                    </View>
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
  searchInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    color: '#333',
  },
  listContent: {
    paddingVertical: 10,
  },
  storeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
  },
  storeImagePlaceholder: {
    backgroundColor: '#D9D9D9',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111',
    marginBottom: 2,
  },
  storeDesc: {
    fontSize: 13,
    color: '#666',
  },
  vazio: {
    textAlign: 'center',
    color: '#999',
    marginTop: 40,
    fontSize: 15,
  },
});
