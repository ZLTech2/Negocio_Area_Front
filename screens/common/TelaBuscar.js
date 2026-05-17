import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
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
import Footer from '../../components/Footer';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { buscarTodasEmpresas } from '../../services/empresaService';
import { API_BASE_URL } from '../../config/api';

export default function TelaBuscar({ navigation }) {
  const [search, setSearch] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          console.log('🔵 iniciando carregamento...');
          const data = await buscarTodasEmpresas();
          console.log('🟢 dados recebidos:', data);
          setEmpresas(data);
        } catch (err) {
          console.log('🔴 erro:', err);
        } finally {
          setCarregando(false);
        }
      };
      carregar();
    }, [])
  );

  const filtered = empresas.filter((e) =>
    (e.nomeEmpresa || e.nome || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
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
                        nomeEmpresa: item.nomeEmpresa || item.nome,
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

  // header roxo com busca integrada
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

  // card limpo sem sombra/borda, igual à imagem
  storeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },

  // foto redonda
  storeImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 14,
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
});
