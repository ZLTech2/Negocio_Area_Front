import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, Pressable } from 'react-native';
import { formatarCNPJ, formatarTelefone, validarEmail, validarCNPJ } from '../../utils/formatacao';

const OPCOES_CUPOM = [5, 10, 15];

const EtapaDados = ({ empresa, setEmpresa, modalVisible, setModalVisible, categorias }) => {
  const [erros, setErros] = useState({ email: '', cnpj: '' });

  const handleEmailChange = (text) => {
    setEmpresa({ ...empresa, email: text });
    if (text.length > 0 && !validarEmail(text)) {
      setErros((e) => ({ ...e, email: 'E-mail inválido' }));
    } else {
      setErros((e) => ({ ...e, email: '' }));
    }
  };

  const handleCNPJChange = (text) => {
    const formatado = formatarCNPJ(text);
    setEmpresa({ ...empresa, cnpj: formatado });
    const digits = formatado.replace(/\D/g, '');
    if (digits.length > 0 && digits.length < 14) {
      setErros((e) => ({ ...e, cnpj: 'CNPJ incompleto' }));
    } else if (digits.length === 14 && !validarCNPJ(formatado)) {
      setErros((e) => ({ ...e, cnpj: 'CNPJ inválido' }));
    } else {
      setErros((e) => ({ ...e, cnpj: '' }));
    }
  };

  return (
    <>
      <Text style={styles.text}>Nome *</Text>
      <TextInput
        style={styles.input}
        value={empresa.nome}
        placeholder="Digite um nome"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => setEmpresa({ ...empresa, nome: text })}
      />

      <Text style={styles.text}>CNPJ *</Text>
      <TextInput
        style={[styles.input, erros.cnpj ? styles.inputErro : null]}
        value={empresa.cnpj}
        placeholder="00.000.000/0000-00"
        placeholderTextColor="#A9A9A9"
        keyboardType="numeric"
        onChangeText={handleCNPJChange}
      />
      {erros.cnpj ? <Text style={styles.textoErro}>{erros.cnpj}</Text> : null}

      <Text style={styles.text}>Email *</Text>
      <TextInput
        style={[styles.input, erros.email ? styles.inputErro : null]}
        value={empresa.email}
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
        value={empresa.telefone}
        placeholder="(11)00000-0000"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => setEmpresa({ ...empresa, telefone: formatarTelefone(text) })}
      />

      <Text style={styles.text}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={empresa.descricao}
        placeholder="Informe a descrição da loja"
        placeholderTextColor="#A9A9A9"
        onChangeText={(text) => setEmpresa({ ...empresa, descricao: text })}
      />

      <Text style={styles.text}>Categoria *</Text>
      <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
        <Text style={{ color: empresa.categoria ? '#000' : '#999' }}>
          {categorias.find((c) => c.value === empresa.categoria)?.label || 'Selecione'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.text}>Cupom de Aniversário 🎂 *</Text>
      <Text style={styles.subtext}>
        Clientes aniversariantes recebem desconto automático na sua loja. Escolha a porcentagem:
      </Text>
      <View style={styles.cupomRow}>
        {OPCOES_CUPOM.map((opcao) => (
          <Pressable
            key={opcao}
            style={[
              styles.cupomOpcao,
              empresa.cupomAniversarioPorcentagem === opcao && styles.cupomOpcaoAtiva,
            ]}
            onPress={() => setEmpresa({ ...empresa, cupomAniversarioPorcentagem: opcao })}
          >
            <Text
              style={[
                styles.cupomOpcaoText,
                empresa.cupomAniversarioPorcentagem === opcao && styles.cupomOpcaoTextAtiva,
              ]}
            >
              {opcao}%
            </Text>
          </Pressable>
        ))}
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione uma categoria</Text>
            {categorias.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.option}
                onPress={() => {
                  setEmpresa({ ...empresa, categoria: item.value });
                  setModalVisible(false);
                }}>
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
              <Text style={{ color: 'red' }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  subtext: {
    marginLeft: 4,
    marginBottom: 8,
    fontSize: 11,
    color: '#666',
    lineHeight: 16,
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
  cupomRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  cupomOpcao: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cupomOpcaoAtiva: {
    borderColor: '#983cff',
    backgroundColor: '#f5f0ff',
  },
  cupomOpcaoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#888',
  },
  cupomOpcaoTextAtiva: {
    color: '#983cff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 15,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
});