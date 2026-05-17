import {
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
  TextInput,
  Alert,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import ImageBackgroundDesf from '../../components/ImageBackgroundDesf';
import { cadastrarCliente } from '../../services/authService';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import EtapaDados from '../../components/cadastroCliente/dadosCliente';
import EtapaEndereco from '../../components/cadastroCliente/etapaEndereco';
import EtapaSenha from '../../components/cadastroCliente/etapaSenha';
import { validarEmail } from '../../utils/formatacao';


const CadastroCliente = ({ navigation }) => {
  const [cliente, setCliente] = useState({
    nome: '',
    cpf: '',
    email: '',
    dataNascimento: new Date(),
    telefone: '',
    endereco: {
      cep: '',
      rua: '',
      numero: '',
      bairro: '',
    },
    senha: '',
    confirmarSenha: '',
  });

  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);
  const [loading, setLoading] = useState(false);

  const validarEtapa1 = () => {
    const { nome, cpf, email, telefone, dataNascimento} = cliente;
    if (!nome || !cpf ||  !email || !telefone || !dataNascimento) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return false;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido!');
      return false;
    }

    return true;
  };

  const validarEtapa2 = () => {
    const { cep, rua, numero, bairro } = cliente.endereco;

    if (!cep || !rua || !numero || !bairro) {
      Alert.alert('Atenção', 'Preencha todos os campos de endereço!');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    const { senha, confirmarSenha } = cliente;

    if (!senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha as senhas');
      return false;
    }
    if (senha !== confirmarSenha) {
      Alert.alert('As senhas não coincidem');
      return false;
    }

     // validação de senha
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;
    if(!regex.test(senha)){
      Alert.alert('Senha fraca', 'A senha deve ter no minimo 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial');
      return false;
  }
    return true;
  };

  const handleCadastro = async () => {
    if (!validarEtapa1()) return;
    if (!validarEtapa2()) return;
    if (!validarEtapa3()) return;

    const numero = parseInt(
      String(cliente.endereco.numero).replace(/\D/g, ''),
      10
    );
    if (Number.isNaN(numero) || numero <= 0) {
      Alert.alert('Erro', 'Numero do endereço inválido');
      return;
    }

    const payload = {
      nome: String(cliente.nome).trim(),
      cpf: String(cliente.cpf).trim(),
      dataNascimento: cliente.dataNascimento
  ? cliente.dataNascimento.toLocaleDateString('en-CA')
  : null,
      telefone: String(cliente.telefone).trim(),
      email: String(cliente.email).trim().toLowerCase(),
      senha: String(cliente.senha),
      endereco: {
        cep: String(cliente.endereco.cep).trim(),
        rua: String(cliente.endereco.rua).trim(),
        numero,
        bairro: String(cliente.endereco.bairro).trim(),
      },
    };

    setLoading(true);

    try {
      await cadastrarCliente(payload);
      Alert.alert('Sucesso!', 'Cliente cadastrado com sucesso 🎉');
      navigation.navigate('TelaLogin');
    } catch (err) {
      Alert.alert('Erro', err?.message || 'Falha ao cadastrar cliente');
    } finally {
      setLoading(false);
    }
  };

  


    const [modalVisible, setModalVisible] = useState(false);
    const [etapa, setEtapa] = useState(1);

  return (
    <ImageBackgroundDesf>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            <View style={styles.container}>
              <Image
                source={require('../../assets/images/logo.png')}
                style={styles.logo}
              />
              <View style={styles.card}>
                {etapa === 1 && (
                  <EtapaDados
                  cliente={cliente}
                  setCliente={setCliente}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                />
                )}

                {etapa === 2 && (
                  <EtapaEndereco
                    cliente={cliente}
                    setCliente={setCliente}
                  />
                )}

                {etapa === 3 && (
                 <EtapaSenha
                 cliente={cliente}
                 setCliente={setCliente}
                 senhaVisivel={senhaVisivel}
                 setSenhaVisivel={setSenhaVisivel}
                 confirmarSenhaVisivel={confirmarSenhaVisivel}
                 setConfirmarSenhaVisivel={setConfirmarSenhaVisivel}
                 />
                )}
              </View>

              <View style={{ width: '100%' }}>
                {etapa > 1 && (
                  <Pressable onPress={() => setEtapa(etapa - 1)}>
                    <Text
                      style={{
                        textAlign: 'center',
                        marginBottom: 10,
                        color: 'white',
                        marginTop: 10
                      }}>
                      Voltar
                    </Text>
                  </Pressable>
                )}

                {etapa < 3 ? (
                  <Pressable
                    style={styles.buttomRegister}
                    onPress={() => {
                      if (etapa === 1 && !validarEtapa1()) return;
                      if (etapa === 2 && !validarEtapa2()) return;
                      setEtapa(etapa + 1);
                    }}>
                    <Text style={styles.textButton}>Próximo</Text>
                  </Pressable>
                ) : (
                  <Pressable
                    style={[styles.buttomRegister, loading && { opacity: 0.6 }]}
                    onPress={handleCadastro}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#000" />
                    ) : (
                      <Text style={styles.textButton}>Cadastrar</Text>
                    )}
                  </Pressable>
                )}
              </View>

              <TouchableOpacity
                onPress={() => navigation.navigate('TelaLogin')}
                style={styles.linkAcesso}>
                <Text style={styles.txtLink}>
                  Já tem cadastro? Faça o Login
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackgroundDesf>
  );
};

export default CadastroCliente;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4.65,
    elevation: 8,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 35,
    resizeMode: 'contain',
  },
  buttomRegister: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#FFF600',
    width: 150,
    borderRadius: 5,
  },
  textButton: {
    color: '#000',
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
  },
 
  txtLink: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  linkAcesso: { marginTop: 15 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});