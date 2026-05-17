import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const EtapaSenha = ({ cliente, setCliente, senhaVisivel, setSenhaVisivel, confirmarSenhaVisivel, setConfirmarSenhaVisivel }) => {
  return (
    <>
      <Text style={styles.text}>Senha *</Text>
      <View style={styles.campoolho}>
        <TextInput
          style={styles.inputSenha}
          placeholder="******"
          placeholderTextColor="#A9A9A9"
          secureTextEntry={!senhaVisivel}
          value={cliente.senha}
          onChangeText={(text) => setCliente({ ...cliente, senha: text })}
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
          value={cliente.confirmarSenha}
          onChangeText={(text) => setCliente({ ...cliente, confirmarSenha: text })}
        />
        <Pressable onPress={() => setConfirmarSenhaVisivel(!confirmarSenhaVisivel)} style={{ padding: 5 }}>
          <MaterialCommunityIcons
            name={confirmarSenhaVisivel ? 'eye-off' : 'eye'}
            size={24}
            color="black"
          />
        </Pressable>
      </View>
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
});