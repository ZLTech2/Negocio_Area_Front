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

             {/* FEED DE CURTIDAS */}
            <Text style={styles.sectionTitle}>Posts que você curtiu</Text>

            {loadingCurtidas ? (
              <ActivityIndicator size="large" color="#983CFF" style={{ marginTop: 20 }} />
            ) : postsCurtidos.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>
                Você ainda não curtiu nenhum post.
              </Text>
            ) : (
            postsCurtidos.map((post) => {
              const postImagemUrl = post.imagem
                ? post.imagem.startsWith('http')
                  ? post.imagem
                  : `${API_BASE_URL}${post.imagem}`
                : null;

              return (
                <Pressable 
                  key={post.idProduto} 
                  style={styles.cardPost}
                  onPress={() => navigation.navigate('DetalhesPost', { produto: post })}
                >
                  {/* PARTE DE CIMA: Título e Preço alinhados na vertical */}
                  <View style={styles.postHeaderContainer}>
                    <Text style={styles.postTitulo}>{post.nome}</Text>
                    <Text style={styles.postPreco}>
                      R$ {post.precoProduto?.toFixed(2)}
                    </Text>
                  </View>

                  {/* PARTE DE BAIXO: Imagem grande centralizada */}
                  <View style={styles.postImageContainer}>
                    {postImagemUrl ? (
                      <Image source={{ uri: postImagemUrl }} style={styles.postImage} />
                    ) : (
                      <View style={[styles.postImage, { backgroundColor: '#EFEFEF', justifyContent: 'center', alignItems: 'center' }]}>
                        <Text style={{ fontSize: 14, color: '#666' }}>Sem imagem</Text>
                      </View>
                    )}
                </View>
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
  colortwo: { 
    height: 150, 
    backgroundColor: '#BFBFBF', 
    justifyContent: 'center' 
  },
  texto: { 
    alignItems: 'center', 
    paddingTop: 50 
  },
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
  nome: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#222' 
  },
  info: { fontSize: 13, 
    color: '#444', 
    marginTop: 2 
  },
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
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333', 
    marginTop: 25, 
    marginBottom: 15,
    paddingHorizontal: 5
  },
  cardPost: { 
    backgroundColor: '#D9D9D9', // Cor de fundo cinza claro para destacar os blocos
    borderRadius: 16, 
    marginBottom: 20, 
    padding: 15,
    overflow: 'hidden',
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
    fontSize: 16,
    color: '#983CFF', // Roxo idêntico ao do seu protótipo
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
});

export default TelaPerfilCliente;