import React, { useState, useRef, useContext } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  PanResponder,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';
import { salvarPreferenciasNotificacao } from '../../services/Notificacao';
import { UserContext } from '../UserContext';
import Toast from 'react-native-toast-message';

const CATEGORIAS_DISPONIVEIS = [
  'Mercado',
  'Papelaria',
  'Eletronicos',
  'Vestuário',
];

export default function ModalNotificacao({ visivel, fechar }) {
  const { authToken } = useContext(UserContext);
  //estado para cada campo no formulario
  const [raio, setRaio] = useState(5);
  const [todasCategorias, setTodasCategorias] = useState(false);
  const [categoriasSelecionadas, setCategoriasSelecionadas] = useState([]);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  //função para salvar e remover tag
  const toggleCategoria = (cat) => {
    if (categoriasSelecionadas.includes(cat)) {
      setCategoriasSelecionadas(
        categoriasSelecionadas.filter((item) => item !== cat)
      );
    } else {
      setCategoriasSelecionadas([...categoriasSelecionadas, cat]);
    }
  };

  //Objeto final que será enviado a API
  const salvarDados = async () => {
    if (!todasCategorias && categoriasSelecionadas.length === 0) {
      setErro('Selecione ao menos uma categoria ou marque todas');
      return;
    }
    const dadosParaAPI = {
      raioMaximoKm: raio,
      receberQualquerPromo: todasCategorias,
      categoriasInteresse: todasCategorias
        ? CATEGORIAS_DISPONIVEIS
        : categoriasSelecionadas,
    };

    try {
      setSalvando(true);
      setErro(null);
      await salvarPreferenciasNotificacao(dadosParaAPI, authToken);
      Toast.show({ type: 'success', text1: 'Preferências salvas com sucesso!' }); 
      fechar(null);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Erro ao salvar preferências', text2: error?.rawText });
      setErro('Não foi possível salvar as preferências. Tente novamente.');
      console.log('Erro', error);
    } finally {
      setSalvando(false);
    }
  };

  const handleFechar = () => {
    setErro(null);
    fechar(null);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visivel}
      onRequestClose={handleFechar}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* HEADER ROXO */}
          <View style={styles.header}>
            <TouchableOpacity onPress={handleFechar} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.titlePrincipal}>Ativar Notificação</Text>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}>
            {/* MENSAGEM DE ERRO */}
            {erro ? (
              <View style={styles.containerErro}>
                <Text style={styles.textoErro}>{erro}</Text>
              </View>
            ) : null}

            {/*seção das categorias */}
            {!todasCategorias && (
              <View style={styles.containerCategoria}>
                <Text style={styles.textSubtitle}>
                  Selecione as categorias de produtos que quer receber
                </Text>
                <View style={styles.containerTags}>
                  {CATEGORIAS_DISPONIVEIS.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.tag,
                        categoriasSelecionadas.includes(cat) && styles.tagAtiva,
                      ]}
                      onPress={() => toggleCategoria(cat)}>
                      <Text
                        style={[
                          styles.tagTexto,
                          categoriasSelecionadas.includes(cat) &&
                          styles.tagTextoAtiva,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/*SEÇÃO DISTANCIA */}
            <View style={styles.containerDistancia}>
              <Text style={styles.textSubtitle}>
                Quero ver produtos de lojas que estão a até {raio}KM
              </Text>
              <CustomSlider raio={raio} setRaio={setRaio} />
            </View>

            {/*SEÇÃO CHECBOX*/}
            <View style={styles.containerCheckbox}>
              <Checkbox
                value={todasCategorias}
                onValueChange={setTodasCategorias}
                color={todasCategorias ? '#983cff' : undefined}
                style={{ marginTop: 2 }}
              />
              <Text> Receber promoções de todas as categorias</Text>
            </View>

            {/*BOTÕES*/}
            <View style={styles.containerButtom}>
              <Pressable
                style={styles.buttomCancelar}
                onPress={handleFechar}>
                <Text style={styles.textButtom}>CANCELAR</Text>
              </Pressable>

              <Pressable style={[styles.buttomSalvar, salvando && { opacity: 0.6 }]} onPress={salvarDados}
                disabled={salvando}>
                <Text style={styles.textButtom}>{salvando ? 'SALVANDO...' : 'SALVAR'}</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function CustomSlider({ raio, setRaio }) {
  const trackWidth = 250;
  const MIN_RAIO = 1;
  const MAX_RAIO = 10;
  const posicaoInicial =
    ((raio - MIN_RAIO) / (MAX_RAIO - MIN_RAIO)) * trackWidth;
  const posicaoBase = useRef(posicaoInicial);
  const [position, setPosition] = useState(posicaoInicial);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,

      onPanResponderGrant: () => {
        posicaoBase.current = position;
      },
      onPanResponderMove: (evt, gestureState) => {
        let newPos = posicaoBase.current + gestureState.dx;

        if (newPos < 0) newPos = 0;
        if (newPos > trackWidth) newPos = trackWidth;

        setPosition(newPos);

        const novoRaio = Math.round(
          MIN_RAIO + (newPos / trackWidth) * (MAX_RAIO - MIN_RAIO)
        );
        setRaio(novoRaio);
      },
    })
  ).current;

  return (
    <View style={{ alignItems: 'center', marginTop: 10 }}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: position }]} />

        <View
          style={[styles.thumb, { left: position - 10 }]}
          {...panResponder.panHandlers}
        />
      </View>

      <View style={styles.labels}>
        <Text>{MIN_RAIO} KM</Text>
        <Text>{MAX_RAIO} KM</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: '90%',
    maxHeight: '80%',
  },
  header: {
    backgroundColor: '#983CFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 15,
  },
  backButton: {
    padding: 2,
  },
  titlePrincipal: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 20,
  },
  containerErro: {
    backgroundColor: '#fdecea',
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 10,
  },
  textoErro: {
    color: '#c0392b',
    fontSize: 13,
    textAlign: 'center',
  },
  containerCategoria: {
    marginLeft: 20,
    marginRight: 20,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#983cff',
    margin: 10,
  },
  tagAtiva: {
    backgroundColor: '#983cff',
    borderColor: '#007AFF',
  },
  tagTexto: {
    color: '#666',
    fontSize: 13,
  },
  tagTextoAtiva: {
    color: 'white',
    fontWeight: 'bold',
  },
  textSubtitle: {
    marginTop: 10,
  },
  containerButtom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    marginRight: 20,
    marginLeft: 20,
  },
  containerDistancia: {
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 20,
  },
  containerCheckbox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 20,
    marginLeft: 20,
  },
  buttomCancelar: {
    backgroundColor: '#FF3C3F',
    width: 100,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttomSalvar: {
    backgroundColor: '#983CFF',
    width: 100,
    paddingVertical: 10,
    borderRadius: 8,
  },
  textButtom: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  containerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  track: {
    width: 250,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    justifyContent: 'center',
    marginTop: 10,
  },
  fill: {
    height: 4,
    backgroundColor: '#983cff',
    borderRadius: 2,
    position: 'absolute',
  },

  thumb: {
    width: 20,
    height: 20,
    backgroundColor: '#983cff',
    borderRadius: 10,
    position: 'absolute',
  },

  labels: {
    width: 250,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
});