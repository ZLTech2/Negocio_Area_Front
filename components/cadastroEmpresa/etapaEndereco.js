import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formatarCEP } from '../../utils/formatacao';
import { buscarCEP } from '../../services/cepService';

const EtapaEndereco = ({ empresa, setEmpresa }) => {
  return (
    <>
      <Text style={styles.text}>CEP *</Text>
      <TextInput
        style={styles.input}
        value={empresa.endereco.cep}
        keyboardType="numeric"
        placeholder="00000-000"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => {
          setEmpresa({ ...empresa, endereco: { ...empresa.endereco, cep: formatarCEP(text) } });
          buscarCEP(text, empresa, setEmpresa);
        }}
      />

      <Text style={styles.text}>Rua *</Text>
      <TextInput
        style={[styles.input, empresa.endereco.rua && styles.inputDesativado]}
        value={empresa.endereco.rua}
        editable={!empresa.endereco.rua}
        onChangeText={(text) =>
          setEmpresa({ ...empresa, endereco: { ...empresa.endereco, rua: text } })
        }
      />

      <Text style={styles.text}>Bairro *</Text>
      <TextInput
        style={[styles.input, empresa.endereco.bairro && styles.inputDesativado]}
        value={empresa.endereco.bairro}
        editable={!empresa.endereco.bairro}
        onChangeText={(text) =>
          setEmpresa({ ...empresa, endereco: { ...empresa.endereco, bairro: text } })
        }
      />

      <Text style={styles.text}>Número *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 19"
        placeholderTextColor="#A9A9A9"
        keyboardType="numeric"
        value={empresa.endereco.numero}
        onChangeText={(text) =>
          setEmpresa({ ...empresa, endereco: { ...empresa.endereco, numero: text } })
        }
      />
    </>
  );
};

export default EtapaEndereco;

const styles = StyleSheet.create({
  text: {
    marginLeft: 4,
    color: '#000',
    fontSize: 13,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    width: '100%',
    height: 34,
    marginBottom: 6,
    padding: 10,
    paddingVertical: 6,
    color: '#7C7C7C',
  },
  inputDesativado: {
    backgroundColor: '#eee',
    color: '#666',
  },
});