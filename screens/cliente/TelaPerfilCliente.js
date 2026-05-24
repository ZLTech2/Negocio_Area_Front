import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
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
import { getFeedCurtidas } from '../../services/curtidaService';
import { buscarPerfilCliente } from '../../services/clienteService';
import * as ImagePicker from 'expo-image-picker';
import { salvarFotoCliente } from '../../services/clienteService';

const TelaPerfilCliente = ({ navigation }) => {

  const { authToken, fotoPerfilCliente, setFotoPerfilCliente } = useContext(UserContext);
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefoneCliente, setTelefoneCliente] = useState('');
  const [cupom, setCupom] = useState(null);
  const [modalLogoff, setModalLogoff] = useState(false);

  //feed de curtidas
  const [postsCurtidos, setPostsCurtidos] = useState([]);
  const [loadingCurtidas, setLoadingCurtidas] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const carregar = async () => {
        try {
          //perfil
          const cliente = await buscarPerfilCliente(authToken);

          console.log(cliente);
          console.log(cliente.urlPerfil);
          
          setNomeCliente(cliente.nome);
          setEmailCliente(cliente.email);
          setTelefoneCliente(cliente.telefone);

          if (cliente.urlPerfil) {
            const foto = cliente.urlPerfil.startsWith('http')
              ? cliente.urlPerfil
              : `${API_BASE_URL}${cliente.urlPerfil}`;

            setFotoPerfilCliente(foto);
          }
        } catch (err) {
          console.log('Erro ao carregar perfil:', err);
        }

        //cupom
        try {
          const cupomData = await getMeuCupom(authToken);
          setCupom(cupomData);
        } catch {
          setCupom(null);
        }

        //feed
        try{
          setLoadingCurtidas(true);
          const feed = await getFeedCurtidas(authToken);
          setPostsCurtidos(feed || []);

        }catch (err) {
          console.log('Erro ao carregar perfil:', err);
        } finally {
          setLoadingCurtidas(false);
        }
      };

      carregar();
    }, [authToken])
  );

  const alterarFotoPerfil = async () => {

    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes:  ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled) return;

      const imagemUri = result.assets[0].uri;

      const data = await salvarFotoCliente(
        imagemUri,
        authToken
      );

      console.log(data);

      const novaFoto = data.urlPerfil?.startsWith('http')
        ? data.urlPerfil
        : `${API_BASE_URL}${data.urlPerfil}`;

      setFotoPerfilCliente(novaFoto);

    } catch (err) {

      console.log('Erro foto perfil:', err);

    }
};

  
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.scroll}>
          <TopBar navigation={navigation} />

          {/* FUNDO */}
          <View style={styles.colorone} />

          <View style={styles.colortwo}>
            <View style={styles.texto}>
              <Text style={styles.nome}>{nomeCliente}</Text>
              <Text style={styles.info}>{emailCliente}</Text>
            </View>

              <View style={styles.contatoConatiner}>
                <Text style={styles.contatoText}>Contato: {telefoneCliente}</Text>
              </View>

              {/* BARRA POSTS CURTIDOS */}
            <View style={styles.botoes}>
              <View style={[styles.botao, styles.botaoAtivo]}>
                <Text style={styles.botaoText}>
                  POSTS QUE VOCÊ CURTIU
                </Text>
              </View>
            </View>
              
            
          </View>

          {/* FOTO DE PERFIL */}
          <Pressable
            style={styles.profile}
            onPress={alterarFotoPerfil}
          >

            {fotoPerfilCliente ? (

              <Image
                source={{ uri: fotoPerfilCliente }}
                style={styles.fotoPerfil}
              />

            ) : (

              <View style={styles.semFotoContainer}>

                <Text style={styles.semFotoText}>
                  Adicionar foto
                </Text>

              </View>

            )}

          </Pressable>

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
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#999', marginBottom:10 }}>
                Nenhum cupom disponível no momento.
              </Text>
            )}

            {loadingCurtidas ? (
              <ActivityIndicator size="large" color="#983CFF" style={{ marginTop: 20 }} />
            ) : postsCurtidos.length === 0 ? (
              <Text style={styles.semCurtidasText}>
                Você ainda não curtiu nenhum post.
              </Text>
            ) : (
            postsCurtidos.map((post, index) => {
              const postImagemUrl = post.imagem
                ? post.imagem.startsWith('http')
                  ? post.imagem
                  : `${API_BASE_URL}${post.imagem}`
                : null;

              return (
                <Pressable
                  key={post.idProduto ?? post.id ?? index}
                  style={styles.cardPost}
                  onPress={() => navigation.navigate('DetalhesPost', { produto: post })}
                >
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.postTitulo}>{post.nome}</Text>

                      <Text style={styles.postPreco}>
                        R$ {post.precoProduto?.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  {postImagemUrl ? (
                    <Image
                      source={{ uri: postImagemUrl }}
                      style={styles.postImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.postImage} />
                  )}
                </Pressable>
              );
            })

          )}
          

            
          </View>

        </ScrollView>

        <Footer />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  scroll: { 
    paddingBottom: 80 
  },
  colorone: {
    height: 130,
    backgroundColor: '#D9D9D9',
  },
  colortwo: { 
    height: 200, 
    backgroundColor: '#BFBFBF', 
    justifyContent: 'space-between',
  },
  texto: { 
    alignItems: 'center', 
    paddingTop: 70,
  },
  profile: {
    backgroundColor: '#8C8C8C',
    position: 'absolute',
    top: 99,
    alignSelf: 'center',
    width: 140,
    height: 140,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fotoPerfil: {
    width: '100%',
    height: '100%',
  },
  semFotoText: {
    textAlign: 'center',
    color: 'white',
    marginTop: 30,
  },
  semFotoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    color: '#222' 
  },
  info: { 
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginTop: 4, 
  },
  feed: {
    marginTop: 40,
    width: '90%',
    alignSelf: 'center',
    paddingBottom: 20,
  },
  contatoContainer: {
    backgroundColor: '#666666',
    width: '100%',
    paddingVertical: 10,
  },
  contatoText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 14,
  },
  botoes: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#BFBFBF',
  },
  botao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoAtivo: {
    backgroundColor: '#D9D9D9',
  },
  botaoText: {
    padding: 10,
    fontSize: 16,
    fontWeight:'500'
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
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 25, 
    marginBottom: 15,
    paddingHorizontal: 5
  },
  cardPost: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    marginBottom: 16, 
    padding: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  postHeaderContainer: {
    marginBottom: 10,
    width: '100%',
  },
  postTitulo: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#222' 
  },
  postPreco: {
    fontSize: 14,
    color: '#983CFF', 
    fontWeight: 'bold',
    marginTop: 2
  },
  postImageContainer: {
    width: '100%',
    backgroundColor: '#fff', // Fundo branco interno onde fica a foto
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: { 
    width: '100%', 
    height: 180, // Altura ajustada para destacar a imagem em baixo dos títulos
    resizeMode: 'cover' 
  },
   semCurtidasText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
});

export default TelaPerfilCliente;