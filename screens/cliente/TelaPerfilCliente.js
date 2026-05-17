import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Footer from '../../components/Footer/FooterCliente';
import TopBar from '../../components/TopBar';
import { UserContext } from '../../components/UserContext';
import { apiFetch } from '../../services/apiFetch';
import { getMeuCupom } from '../../services/cupomService';
import { useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from '../../config/api';
import { Pressable } from 'react-native';
import ModalLogoff from '../../components/modals/ModalLogoff';

const TelaPerfilCliente = ({ navigation }) => {

  const { authToken, fotoPerfilCliente, setFotoPerfilCliente } = useContext(UserContext);
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [cupom, setCupom] = useState(null);
  const [modalLogoff, setModalLogoff] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          const cliente = await apiFetch('/clientes/me', { token: authToken });
          setNomeCliente(cliente.nome);
          setEmailCliente(cliente.email);
          setTelefoneCliente(cliente.telefone);

          if (cliente.logoUrl) {
            setFotoPerfilCliente(`${API_BASE_URL}${cliente.logoUrl}`);
          }
        } catch (err) {
          console.log('Erro ao carregar perfil:', err);
        }

        try {
          const cupomData = await getMeuCupom(authToken);
          setCupom(cupomData);
        } catch {
          setCupom(null);
        }
      };
      carregar();
    }, [authToken])
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
          <TopBar navigation={navigation} />

          <View style={styles.colortwo}>
            <View style={styles.texto}>
              <Text style={styles.nome}>{nomeCliente}</Text>
              <Text style={styles.info}>{emailCliente}</Text>
              <Text style={styles.info}>{telefoneCliente}</Text>
            </View>
          </View>

          {/* FOTO DE PERFIL */}
          <View style={styles.profile}>
            {fotoPerfilCliente ? (
              <Image
                source={{ uri: fotoPerfilCliente }}
                style={{ width: 140, height: 140, borderRadius: 100 }}
              />
            ) : (
              <Text style={{ textAlign: 'center', color: 'white', marginTop: 30 }}>
                Sem foto
              </Text>
            )}
          </View>

          <View style={styles.feed}>
            {cupom ? (
              <View style={styles.cardCupom}>
                <Text style={styles.cupomTitulo}>🎂 Cupom de Aniversário</Text>
                <Text style={styles.cupomDesconto}>Desconto especial disponível!</Text>
                <Text style={styles.cupomCodigo}>Código: {cupom.codigo}</Text>
                <Text style={styles.cupomValidade}>
                  Válido até: {new Date(cupom.validadeAte).toLocaleDateString('pt-BR')}
                </Text>
              </View>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                Nenhum cupom disponível no momento.
              </Text>
            )}

            
          </View>

        </ScrollView>

        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { paddingBottom: 80 },
  colortwo: { height: 150, backgroundColor: '#BFBFBF', justifyContent: 'center' },
  texto: { alignItems: 'center', paddingTop: 50 },
  profile: {
    backgroundColor: '#8C8C8C',
    position: 'absolute',
    top: 99,
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    margin: 20,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  nome: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  info: { fontSize: 13, color: '#444', marginTop: 2 },
  feed: {
    marginTop: 80,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  cardCupom: {
    backgroundColor: '#983CFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  cupomCodigo: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  letterSpacing: 2,
  marginTop: 8,
},
  cupomTitulo: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
  },
  cupomDesconto: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  cupomValidade: {
    color: '#e0c4ff',
    fontSize: 12,
  },
});

export default TelaPerfilCliente;