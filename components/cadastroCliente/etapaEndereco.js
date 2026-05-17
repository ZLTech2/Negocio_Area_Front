import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { formatarCEP } from '../../utils/formatacao';
import { buscarCEP } from '../../services/cepService';

const EtapaEndereco = ({ cliente, setCliente }) => {
  return (
    <>
      <Text style={styles.text}>CEP *</Text>
      <TextInput
        style={styles.input}
        value={cliente.endereco.cep}
        keyboardType="numeric"
        placeholder="00000-000"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => {
          setCliente({ ...cliente, endereco: { ...cliente.endereco, cep: formatarCEP(text) } });
          buscarCEP(text, cliente, setCliente);
        }}
      />

      <Text style={styles.text}>Rua *</Text>
      <TextInput
        style={[styles.input, cliente.endereco.rua && styles.inputDesativado]}
        value={cliente.endereco.rua}
        editable={!cliente.endereco.rua}
        onChangeText={(text) =>
          setCliente({ ...cliente, endereco: { ...cliente.endereco, rua: text } })
        }
      />

      <Text style={styles.text}>Bairro *</Text>
      <TextInput
        style={[styles.input, cliente.endereco.bairro && styles.inputDesativado]}
        value={cliente.endereco.bairro}
        editable={!cliente.endereco.bairro}
        onChangeText={(text) =>
          setCliente({ ...cliente, endereco: { ...cliente.endereco, bairro: text } })
        }
      />

      <Text style={styles.text}>Número *</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 19"
        placeholderTextColor="#A9A9A9"
        keyboardType="numeric"
        value={cliente.endereco.numero}
        onChangeText={(text) =>
          setCliente({ ...cliente, endereco: { ...cliente.endereco, numero: text } })
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