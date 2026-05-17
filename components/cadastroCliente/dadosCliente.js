import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { formatarTelefone, validarEmail, formatarCPF } from '../../utils/formatacao';

const formatarData = (texto) => {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0,2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0,2)}/${numeros.slice(2,4)}/${numeros.slice(4)}`;
};

const parsarData = (texto) => {
  const partes = texto.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;
  const [dia, mes, ano] = partes.map(Number);
  const data = new Date(ano, mes - 1, dia);
  if (isNaN(data.getTime()) || data > new Date()) return null;
  return data;
};

const EtapaDados = ({ cliente, setCliente }) => {
  const [textoData, setTextoData] = useState('');
  const [erros, setErros] = useState({ email: '', data: '' });

  const handleEmailChange = (text) => {
    setCliente({ ...cliente, email: text });
    if (text.length > 0 && !validarEmail(text)) {
      setErros((e) => ({ ...e, email: 'E-mail inválido' }));
    } else {
      setErros((e) => ({ ...e, email: '' }));
    }
  };

  const handleData = (texto) => {
    const formatado = formatarData(texto);
    setTextoData(formatado);
    setErros((e) => ({ ...e, data: '' }));

    if (formatado.length === 10) {
      const data = parsarData(formatado);
      if (data) {
        setCliente({ ...cliente, dataNascimento: data });
      } else {
        setErros((e) => ({ ...e, data: 'Data inválida ou futura' }));
      }
    }
  };

  return (
    <>



      <Text style={styles.text}>Nome *</Text>
      <TextInput
        style={styles.input}
        value={cliente.nome}
        placeholder="Digite um nome"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => setCliente({ ...cliente, nome: text })}
      />

      <Text style={styles.text}>CPF *</Text>
      <TextInput
        style={styles.input}
        value={cliente.cpf}
        placeholder="000.000.000-00"
        placeholderTextColor="#A9A9A9"
        keyboardType="numeric"
        maxLength={14}
        onChangeText={(text) => setCliente({ ...cliente, cpf: formatarCPF(text) })}
      />

      <Text style={styles.text}>Email *</Text>
      <TextInput
        style={[styles.input, erros.email ? styles.inputErro : null]}
        value={cliente.email}
        placeholder="exemplo@gmail.com"
        placeholderTextColor="#A9A9A9"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={handleEmailChange}
      />
      {erros.email ? <Text style={styles.textoErro}>{erros.email}</Text> : null}

      <Text style={styles.text}>Telefone *</Text>
      <TextInput
        style={styles.input}
        value={cliente.telefone}
        placeholder="(11)00000-0000"
        placeholderTextColor="#A9A9A9"
        keyboardType="phone-pad"
        onChangeText={(text) => setCliente({ ...cliente, telefone: formatarTelefone(text) })}
      />

      <Text style={styles.text}>Data de nascimento *</Text>
      <TextInput
        style={[styles.input, erros.data ? styles.inputErro : null]}
        value={textoData}
        placeholder="DD/MM/AAAA"
        placeholderTextColor="#A9A9A9"
        keyboardType="numeric"
        maxLength={10}
        onChangeText={handleData}
      />
      {erros.data ? <Text style={styles.textoErro}>{erros.data}</Text> : null}
    </>
  );
};

export default EtapaDados;

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
    marginBottom: 2,
    padding: 10,
    paddingVertical: 6,
    color: '#7C7C7C',
  },
  inputErro: {
    borderColor: '#e53e3e',
    backgroundColor: '#fff5f5',
  },
  textoErro: {
    color: '#e53e3e',
    fontSize: 11,
    marginBottom: 6,
    marginLeft: 4,
  },
});