import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function ModalTermos({ visivel, onAceitar, onRecusar }) {
  return (
    <Modal
      visible={visivel}
      transparent
      animationType="slide"
      onRequestClose={onRecusar}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitulo}>Termos de Uso</Text>

          <ScrollView style={styles.termosScroll}>
            <Text style={styles.termosTexto}>
              Ao se cadastrar na plataforma Negocio na Área, você concorda com
              os seguintes termos:{'\n\n'}
              1. Suas informações serão utilizadas exclusivamente para fins de
              operação do aplicativo.{'\n\n'}
              2. Você é responsável pela veracidade dos dados cadastrados,
              incluindo CNPJ e endereço.{'\n\n'}
              3. É proibido o cadastro de produtos ilegais ou que violem
              direitos de terceiros.{'\n\n'}
              4. A plataforma pode suspender contas que violem as políticas de
              uso.{'\n\n'}
              5. Seus dados são protegidos conforme a Lei Geral de Proteção de
              Dados (LGPD).{'\n\n'}
              6. Cupom de aniversário: ao se cadastrar, a empresa define o
              percentual de desconto do cupom de aniversário. Esse cupom é
              gerado automaticamente pela plataforma para clientes
              aniversariantes e pode ser utilizado em qualquer loja cadastrada.
              Ao se cadastrar, a empresa declara estar ciente dessa regra.
              {'\n\n'}
              7. Ao continuar, você declara ter lido e aceito integralmente
              estes termos.
            </Text>
          </ScrollView>

          <Pressable style={styles.botaoAceitar} onPress={onAceitar}>
            <Text style={styles.botaoAceitarText}>Aceitar e fechar</Text>
          </Pressable>

          <Pressable onPress={onRecusar}>
            <Text style={styles.botaoRecusar}>Recusar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    color: '#222',
  },
  termosScroll: {
    maxHeight: 280,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  termosTexto: {
    fontSize: 13,
    color: '#444',
    lineHeight: 20,
  },
  botaoAceitar: {
    backgroundColor: '#983cff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  botaoAceitarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  botaoRecusar: {
    textAlign: 'center',
    color: '#888',
    fontSize: 13,
    padding: 6,
  },
});
