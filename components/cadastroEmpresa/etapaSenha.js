import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet,
  Modal, ScrollView,
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MaterialIcons } from '@expo/vector-icons';
import ModalTermos from '../modals/ModalTermos'

const EtapaSenha = ({
  empresa, setEmpresa,
  senhaVisivel, setSenhaVisivel,
  confirmarSenhaVisivel, setConfirmarSenhaVisivel,
  termosAceitos, setTermosAceitos, 
}) => {
  const [modalTermos, setModalTermos] = useState(false);

  return (
    <>
      <Text style={styles.text}>Senha *</Text>
      <View style={styles.campoolho}>
        <TextInput
          style={styles.inputSenha}
          placeholder="******"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!senhaVisivel}
          value={empresa.senha}
          onChangeText={(text) => setEmpresa({ ...empresa, senha: text })}
        />
        <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)} style={{ padding: 5 }}>
          <MaterialCommunityIcons
            name={senhaVisivel ? 'eye-off' : 'eye'}
            size={24}
            color="black"
          />
        </Pressable>
      </View>

      <Text style={styles.text}>Confirmar senha *</Text>
      <View style={styles.campoolho}>
        <TextInput
          style={styles.inputSenha}
          placeholder="******"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!confirmarSenhaVisivel}
          value={empresa.confirmarSenha}
          onChangeText={(text) => setEmpresa({ ...empresa, confirmarSenha: text })}
        />
        <Pressable onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} style={{ padding: 5 }}>
          <MaterialCommunityIcons
            name={confirmarSenhaVisivel ? 'eye-off' : 'eye'}
            size={24}
            color="black"
          />
        </Pressable>
      </View>

      {/* CHECKBOX TERMOS */}
      <Pressable
        style={styles.checkboxRow}
        onPress={() => {
          if (!termosAceitos) setModalTermos(true);
          else setTermosAceitos(false);
        }}
      >
        <MaterialIcons
          name={termosAceitos ? 'check-box' : 'check-box-outline-blank'}
          size={22}
          color={termosAceitos ? '#983cff' : '#888'}
        />
        <Text style={styles.checkboxLabel}>
          Li e aceito os{' '}
          <Text style={styles.linkTermos} onPress={() => setModalTermos(true)}>
            Termos de Uso
          </Text>
        </Text>
      </Pressable>

      {/* MODAL TERMOS */}
      <ModalTermos
      visivel={modalTermos}
  onAceitar={() => {
    setTermosAceitos(true);
    setModalTermos(false);
  }}
  onRecusar={() => setModalTermos(false)}
      />

      <Text />
    </>
  );
};

export default EtapaSenha;

const styles = StyleSheet.create({
  text: {
    marginLeft: 4,
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  campoolho: {
    alignItems: 'center',
    width: '100%',
    flexDirection: 'row',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 34,
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  inputSenha: {
    flex: 1,
    height: '100%',
    color: '#7C7C7C',
  },

  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#333',
    flexShrink: 1,
  },
  linkTermos: {
    color: '#983cff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },

  // Modal
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