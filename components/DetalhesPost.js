import React, { useState, useContext, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import TopBar from "./TopBar";
import Footer from "./Footer";
import { API_BASE_URL } from '../config/api';
import { alternarCurtida, obterStatusCurtida } from '../services/curtidaService';
import { UserContext } from './UserContext';

export default function DetalhesPost({ route, navigation }) {
  const { produto } = route.params;
  const { authToken } = useContext(UserContext);

  const [curtido, setCurtido] = useState(produto.curtido || false);
  const [loading, setLoading] = useState(false);

  const imagemUrl = produto.imagem
  ? produto.imagem.startsWith('http')
    ? produto.imagem
    : `${API_BASE_URL}${produto.imagem}`
  : null;

  // CONSISTÊNCIA 1: Busca o status atualizado do banco assim que o usuário entra na tela
  useEffect(() => {
    async function checarStatusCurtida() {
      if (!authToken) return;
      try {
        // Chama a rota GET através do seu service unificado
        const jaCurtido = await obterStatusCurtida(produto.id || produto.idProduto, authToken);
        setCurtido(jaCurtido === true); // Define o estado visual baseado na resposta do Java
      } catch (error) {
        console.log("Erro ao checar status inicial da curtida:", error);
      }
    }

    checarStatusCurtida();
  }, [produto.id, produto.idProduto, authToken]);

   async function handleCurtida() {
   if (loading) return; // Ignora cliques extras se já estiver processando

    // Muda o visual na hora para dar sensação de velocidade (Optimistic Update)
    setCurtido(prev => !prev);
    setLoading(true);

    try {
      // Envia a requisição usando a sua função separada
      await alternarCurtida(produto.id, authToken);
    } catch (error) {
      console.log("Erro curtida:", error);
      // Se a API der o erro (como aquele do log), desfaz a mudança visual na hora
      setCurtido(prev => !prev);
    } finally {
      setLoading(false);
    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <TopBar navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {imagemUrl ? (
          <Image source={{ uri: imagemUrl }} style={styles.imageLarge} />
        ) : (
          <View style={[styles.imageLarge, { backgroundColor: '#D9D9D9' }]} />
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.title}>{produto.nome}</Text>
          <Text style={styles.price}>R$ {produto.precoProduto?.toFixed(2)}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Descrição</Text>
          <Text style={styles.description}>{produto.descricaoProduto}</Text>

          {/* BOTÃO CURTIR */}
          <Pressable onPress={handleCurtida} disabled={loading} style={[styles.btnCurtir, curtido && styles.btnCurtirAtivo]}>
            {loading ? (
              <ActivityIndicator color={curtido ? "#fff" : "#983CFF"} />
            ) : (
              <>
                <EvilIcons
                  name="like"
                  size={35}
                  color={curtido ? "#fff" : "#983CFF"}
                />

                <Text style={[styles.btnText, curtido && styles.btnTextAtivo]}>
                  {curtido ? "Curtido" : "Curtir"}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageLarge: {
    width: '100%',
    height: 350,
    resizeMode: 'cover'
  },
  infoContainer: {
    padding: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  price: {
    fontSize: 22,
    color: '#983CFF',
    fontWeight: 'bold',
    marginVertical: 10
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
    lineHeight: 22
  },
  btnCurtir: {
    width: '90%',
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    borderColor: '#983CFF',
    borderWidth: 2
  },
  btnText: {
    color: '#983CFF',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  btnCurtirAtivo: {
  backgroundColor: '#983CFF',
  },
  btnTextAtivo: {
    color: '#fff',
  },
});