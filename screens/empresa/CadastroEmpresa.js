import {
  StyleSheet,
  Text,
  Image,
  View,
  Pressable,
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
import { cadastrarEmpresa } from '../../services/authService';
import EtapaDados from '../../components/cadastroEmpresa/dadosEmpresa';
import EtapaEndereco from '../../components/cadastroEmpresa/etapaEndereco';
import EtapaSenha from '../../components/cadastroEmpresa/etapaSenha';
import { validarEmail, validarCNPJ } from '../../utils/formatacao';


const CadastroEmpresa = ({ navigation }) => {
  const [empresa, setEmpresa] = useState({
    nome: '',
    cnpj: '',
    email: '',
    descricao: '',
    categoria: '',
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
  const [termosAceitos, setTermosAceitos] = useState(false);

  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const validarEtapa1 = () => {
    const { nome, cnpj, email, telefone, categoria } = empresa;

    if (!nome || !cnpj || !email || !telefone || !categoria) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios!');
      return false;
    }

    if (!validarEmail(email)) {
      Alert.alert('Erro', 'Digite um e-mail válido!');
      return false;
    }

    if (!validarCNPJ(cnpj)) {
      Alert.alert('Erro', 'CNPJ inválido!');
      return false;
    }

    return true;
  };

  

  const validarEtapa2 = () => {
    const { cep, rua, numero, bairro } = empresa.endereco;

    if (!cep || !rua || !numero || !bairro) {
      Alert.alert('Atenção', 'Preencha todos os campos de endereço!');
      return false;
    }
    return true;
  };

  const validarEtapa3 = () => {
    const { senha, confirmarSenha } = empresa;

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

    if(!termosAceitos){
      Alert.alert('Atenção', 'Você precisa aceitar os Termos de Uso');
      return;
    }
    const numero = parseInt(
      String(empresa.endereco.numero).replace(/\D/g, ''),
      10
    );
    if (Number.isNaN(numero) || numero <= 0) {
      Alert.alert('Erro', 'Numero do endereço inválido');
      return;
    }

    const payload = {
      nome: String(empresa.nome).trim(),
      cnpj: String(empresa.cnpj).replace(/\D/g, ''),
      categoria: String(empresa.categoria).trim(),
      telefone: String(empresa.telefone).trim(),
      email: String(empresa.email).trim().toLowerCase(),
      descricao: String(empresa.descricao || '').trim(),
      senha: String(empresa.senha),
      percentualCupomAniversario: empresa.cupomAniversarioPorcentagem ?? 0,
      endereco: {
        cep: String(empresa.endereco.cep).trim(),
        rua: String(empresa.endereco.rua).trim(),
        numero,
        bairro: String(empresa.endereco.bairro).trim(),
      },
    };

    setLoading(true);

    try {
      await cadastrarEmpresa(payload);
      Alert.alert('Sucesso!', 'Empresa cadastrada com sucesso 🎉');
      navigation.navigate('TelaLogin');
    } catch (err) {
      Alert.alert('Erro', err?.message || 'Falha ao cadastrar empresa');
    } finally {
      setLoading(false);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const categorias = [
    { label: 'Alimentação', value: 'alimentacao' },
    { label: 'Eletrônicos', value: 'eletronicos' },
    { label: 'Vestuário', value: 'vestuario' },
    { label: 'Papelaria', value: 'papelaria' },
  ];
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
                  empresa={empresa}
                  setEmpresa={setEmpresa}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  categorias={categorias}    
                />
                )}

                {etapa === 2 && (
                  <EtapaEndereco
                    empresa={empresa}
                    setEmpresa={setEmpresa}
                  />
                )}

                {etapa === 3 && (
                 <EtapaSenha
                 empresa={empresa}
                 setEmpresa={setEmpresa}
                 senhaVisivel={senhaVisivel}
                 setSenhaVisivel={setSenhaVisivel}
                 confirmarSenhaVisivel={confirmarSenhaVisivel}
                 setConfirmarSenhaVisivel={setConfirmarSenhaVisivel}
                 termosAceitos = {termosAceitos}
                 setTermosAceitos ={setTermosAceitos}
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

export default CadastroEmpresa;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    padding: 10,
    backgroundColor: '#fff',
    maxWidth: 340,
    width: '100%',
    borderRadius: 20,
    marginBottom: 15,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 35,
    resizeMode: 'contain',
  },
  buttomRegister: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#FFF600',
    width: '100%',
    borderRadius: 10,
  },
  textButton: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  txtLink: {
    color: 'white',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },

  linkAcesso: { marginTop: 15 },
});