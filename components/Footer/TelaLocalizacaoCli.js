import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
} from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import TopBar from '../../components/TopBar';
import FooterCliente from './FooterCliente';
import { buscarTodasEmpresas } from '../../services/empresaService';

// somente mostra o mapa se for android ou ios
let MapView, Marker;
if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
}

const TelaLocalizacaoCli = ({ navigation }) => {
  const [empresas, setEmpresas] = useState([]);
  const [busca, setBusca] = useState('');
  const [modo, setModo] = useState('mapa');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await buscarTodasEmpresas();
        const comCoordenadas = data.filter(
          (e) => e.latitude != null && e.longitude != null
        );
        setEmpresas(comCoordenadas);
      } catch (err) {
        console.log('Erro ao carregar empresas:', err);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, []);

  const resultados = empresas.filter((e) =>
    (e.nomeEmpresa || e.nome || '').toLowerCase().includes(busca.toLowerCase())
  );
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
          {/* HEADER */}
          <TopBar navigation={navigation} />

          {/* BARRA DE PESQUISA */}
          <View style={styles.pesquisa}>
            <FontAwesome6 name="magnifying-glass" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Buscar empresas"
              placeholderTextColor="rgb(0,0,0,0.5)"
              value={busca}
              onChangeText={setBusca}
            />
          </View>

          {/* BOTÕES MODO */}
          <View style={styles.sessaobotoes}>
            <Pressable
              style={[styles.botao, modo === 'mapa' && styles.botaoAtivo]}
              onPress={() => setModo('mapa')}>
              <Text style={styles.textoBotao}>Mapa</Text>
            </Pressable>
            <Pressable
              style={[styles.botao, modo === 'lista' && styles.botaoAtivo]}
              onPress={() => setModo('lista')}>
              <Text style={styles.textoBotao}>Lista</Text>
            </Pressable>
          </View>

          {/* CONTEÚDO PRINCIPAL */}
          <View>
            {modo === 'mapa' ? (
              Platform.OS === 'web' ? (
                <View style={styles.mapaIndisponivel}>
                  <Text style={styles.mensagem}>
                    Mapa indisponível na versão web
                  </Text>
                </View>
              ) : (
                <MapView
                  style={{ width: '100%', height: 490 }}
                  initialRegion={{
                    latitude: -23.5319,
                    longitude: -46.36951,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}>
                  {empresas.map((empresa) => (
                    <Marker
                      key={empresa.id}
                      coordinate={{
                        latitude: empresa.latitude,
                        longitude: empresa.longitude,
                      }}
                      pinColor="#983cff"
                      title={empresa.nome}
                      description={
                        empresa.enderecoCompleto ||
                        [
                          empresa.endereco?.rua,
                          empresa.endereco?.numero,
                          empresa.endereco?.bairro,
                          empresa.endereco?.cep,
                        ]
                          .filter(Boolean)
                          .join(', ')
                      }
                    />
                  ))}
                </MapView>
              )
            ) : (
              <View style={styles.lista}>
                {resultados.map((empresa) => (
                  <View key={empresa.id} style={styles.containerLista}>
                    <Text style={styles.nomeLoja}>
                      {empresa.nomeEmpresa || empresa.nome}
                    </Text>

                    <View style={styles.localizacao}>
                      <MaterialCommunityIcons
                        name="map-marker-outline"
                        size={24}
                        color="gray"
                      />
                      <Text style={styles.detalhes}>
                        {empresa.enderecoCompleto ||
                          [
                            empresa.endereco.rua,
                            empresa.endereco.numero,
                            empresa.endereco.bairro,
                            empresa.endereco.cep,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                      </Text>
                    </View>

                    <View style={styles.localizacao}>
                      <MaterialCommunityIcons
                        name="phone"
                        size={24}
                        color="gray"
                      />
                      <Text style={styles.detalhes}>
                        {empresa.telefone || 'Não informado'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <FooterCliente />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 80 },
  pesquisa: {
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 1,
    width: '90%',
    paddingHorizontal: 10,
    alignSelf: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  input: { flex: 1, paddingVertical: 8, paddingLeft: 10, outlineWidth: 0 },
  sessaobotoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 20,
  },
  botao: {
    backgroundColor: '#983cff',
    height: 40,
    width: '35%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoAtivo: { backgroundColor: 'rgba(152, 60, 255, 0.7)' },
  textoBotao: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  lista: { padding: 10 },
  containerLista: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.2)',
    borderTopColor: 'rgba(0,0,0,0.2)',
    marginBottom: 10,
    paddingTop: 10,
    paddingLeft: 10,
  },
  nomeLoja: {
    backgroundColor: 'rgba(152, 60, 255, 0.7)',
    fontSize: 16,
    color: 'white',
    paddingLeft: 10,
    borderRadius: 5,
    width: '50%',
  },
  localizacao: { flexDirection: 'row', marginTop: 5, alignItems: 'center' },
  detalhes: { fontSize: 16, paddingLeft: 5, width: '90%' },
  mapaIndisponivel: {
    height: 490,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mensagem: {
    color: 'gray',
    fontSize: 16,
  },
});

export default TelaLocalizacaoCli;
