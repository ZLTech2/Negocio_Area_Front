import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ImageBackgroundDesf from '../../components/ImageBackgroundDesf';
import { useContext } from 'react';
import { UserContext } from '../../components/UserContext';
import { login } from '../../services/authService';
import { buscarPerfilEmpresa } from '../../services/empresaService';

const TelaLogin = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [activity, setActivity] = useState(false);
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const { setVisitante, setAuthToken, setAuthTipo, setAuthExpiresAt, setEmpresaId, limparPerfilEmpresa, setFotoPerfilEmpresa, setNomeLoja, setDescricaoLoja, setTelefoneLoja } =
    useContext(UserContext);

  const [status, setStatus] = useState('');
  const [erros, setErros] = useState({
    email: '',
    senha: '',
  });

  const ValidarLogin = async (email, senha) => {
  if (!email || !senha) {
    alert('Preencha todos os campos');
    return;
  }

  setActivity(true);
  try {
    const response = await login(email, senha);
    setVisitante(false);
    setAuthToken(response?.token || null);
    setAuthTipo(response?.tipo || null);
    setAuthExpiresAt(response?.expiresAt || null);
    setEmpresaId(response?.idEmpresa || null);

    if (response?.tipo === 'empresa') {
      try {
        const perfil = await buscarPerfilEmpresa(response.token);
        if (perfil?.logoUrl) {
          const fotoCompleta = perfil.logoUrl.startsWith('http')
            ? perfil.logoUrl
            : `${API_BASE_URL}${perfil.logoUrl}`;
          setFotoPerfilEmpresa(fotoCompleta);
        }
        if (perfil?.nome) setNomeLoja(perfil.nome);
        if (perfil?.descricao) setDescricaoLoja(perfil.descricao);
        if (perfil?.telefone) setTelefoneLoja(perfil.telefone);
      } catch (e) {
        console.log('Erro ao carregar perfil após login:', e);
      }
      navigation.replace('FeedEmpresa');
    } else {
      navigation.replace('FeedCliente');
    }
  } catch (err) {
    if (err?.status === 401) {
      alert('Usuario ou senha inválidos');
    } else {
      alert(err?.message || 'Falha ao realizar login');
    }
  } finally {
    setActivity(false);
  }
};

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackgroundDesf>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            keyboardShouldPersistTaps="handled">
            <Image
              source={require('../../assets/images/logord.png')}
              style={styles.imagem}></Image>
            <View style={styles.quadro}>
              <View style={styles.campo}>
                <View style={styles.labelInput}>
                  {erros.email !== '' ? (
                    <Text style={styles.erros}>{erros.email}</Text>
                  ) : (
                    <Text></Text>
                  )}
                  <Text style={styles.label}> Email </Text>
                  <TextInput
                    placeholder="email@email.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    style={[styles.input, { paddingLeft: 10 }]}
                   
                    placeholderTextColor="rgba(0,0,0,0.3)"
                  />
                </View>
              </View>
              <View style={styles.campo}>
                <View style={styles.labelInput}>
                  {erros.senha !== '' ? (
                    <Text style={styles.erros}>{erros.senha}</Text>
                  ) : (
                    <Text></Text>
                  )}
                  <Text style={styles.label}> Senha </Text>

                  <View style={styles.campoolho}>
                    <TextInput
                      placeholder="******"
                      value={senha}
                      onChangeText={setSenha}
                      style={styles.inputSenha}
                      placeholderTextColor="rgba(0,0,0,0.3)"
                      secureTextEntry={!senhaVisivel}
                    />
                    <Pressable
                      onPress={() => setSenhaVisivel(!senhaVisivel)}
                      style={{ padding: 5 }}>
                      <MaterialCommunityIcons
                        name={senhaVisivel ? 'eye-off' : 'eye'}
                        size={24}
                        color="black"
                      />
                    </Pressable>
                  </View>
                </View>
              </View>

              {/*carregamento */}
              {activity && (
                <View style={{ marginTop: 10 }}>
                  <ActivityIndicator
                    size="large"
                    animating={activity}
                    color="#983cff"
                  />
                </View>
              )}
              {/*botao para logar */}
              <Pressable
                onPress={() => ValidarLogin(email, senha)}
                disabled={activity}>
                {({ pressed }) => (
                  <Text
                    style={[
                      styles.textBotao,
                      {
                        backgroundColor: activity ? '#ccc' : pressed ? '#fff600' : '#983cff',
                        color: activity || pressed ? 'black' : 'white',
                      },
                    ]}>
                    {activity ? 'Entrando...' : 'Entrar'}{' '}
                  </Text>
                )}
              </Pressable>

              <View style={styles.cadastro}>
                <Pressable
                  onPress={() => navigation.navigate('TelaEsquecerSenha')}>
                  {({ pressed }) => (
                    <Text
                      style={[
                        styles.conta,
                        {
                          color: pressed ? '#fff600' : 'black',
                        },
                      ]}>
                      Esqueci a senha
                    </Text>
                  )}
                </Pressable>

                <View style={styles.linha}>
                  <Text style={styles.conta}>Não possui conta? </Text>
                  <Pressable
                    style={styles.conta}
                    //navegação para a tela de cadastro
                    onPress={() => navigation.navigate('TipoCadastro')}>
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.cadastro,
                          { color: pressed ? '#fff600' : 'black' },
                        ]}>
                        Cadastre-se
                      </Text>
                    )}
                  </Pressable>
                </View>
                <View style={styles.linha}>
                  <Pressable
                    onPress={() => {
                      setVisitante(true);
                      navigation.navigate('TelaVisitante');
                    }}>
                    {({ pressed }) => (
                      <Text
                        style={[
                          styles.cadastro,
                          { color: pressed ? '#fff600' : 'black' },
                        ]}>
                        Entre como visitante
                      </Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackgroundDesf>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  imagem: {
    height: 120,
    width: 120,
    justifyContent: 'center',
    marginBottom: 20,
  },
  quadro: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    width: 300,
    borderRadius: 20,
    height: 500,
    fontSize: 16,
  },
  label: {
    color: '#000000',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
  },
  labelInput: {
    alignItems: 'flex-start',
    width: '75%',
    marginTop: 20,
  },
  campo: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },

  campoolho: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: 'space-between',
  },
  inputSenha: {
    flex: 1,
    height: '100%',
    paddingRight: 14,
  },
  input: {
    fontSize: 14,
    height: 40,
    width: '100%',
    borderRadius: 5,
    borderColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1.5,
  },
  textBotao: {
    fontSize: 16,
    textTransform: 'uppercase',
    fontWeight: 700,
    marginTop: 20,
    borderRadius: 5,
    paddingHorizontal: 30,
    height: 40,
    textAlign: 'center',
    paddingTop: 10,
    borderWidth: 0.5,
  },
  conta: {
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 20,
  },
  cadastro: {
    alignItems: 'center',
    color: 'black',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TelaLogin;