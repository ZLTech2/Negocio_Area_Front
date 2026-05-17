import { View, Pressable, StyleSheet, Image, Text } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { UserContext } from '../UserContext';
import { useContext, useState } from 'react';

const FooterCliente = () => {
  const navigation = useNavigation();
  const { fotoPerfilCliente, visitante } = useContext(UserContext);
  const fotoPerfil = fotoPerfilCliente;
  const [msg, setMsg] = useState("");

  // Função para mostrar mensagem temporária
  const showMessage = (text) => {
    setMsg(text);
    setTimeout(() => setMsg(''), 3000); // some depois de 3 segundos
  };

  // Função para ações bloqueadas para visitantes
  const handleBlockedAction = () => {
    showMessage("Faça login para acessar. Toque aqui.");
  };

  // Função para navegar em telas bloqueadas
  const navigateIfAllowed = (screen) => {
    if (visitante) {
      handleBlockedAction();
      return;
    }
    navigation.navigate(screen);
  };

  return (
    <View style={styles.rodape}>
      {/* Mensagem temporária */}
      {msg !== '' && (
        <Text
          style={styles.msg}
          onPress={() => navigation.navigate('TelaLogin')} // permite navegar para login
        >
          {msg}
        </Text>
      )}

      {/* Botões do footer */}
      <Pressable
        onPress={() => navigation.navigate('FeedCliente', { irParaHome: true })}
        style={({ pressed }) => [
          pressed && { transform: [{ scale: 1.5 }], opacity: 0.4 },
        ]}>
        <AntDesign name="home" size={30} color="white" />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TelaBuscarCliente', { irParaHome: true })}
        style={({ pressed }) => [
          pressed && { transform: [{ scale: 1.5 }], opacity: 0.4 },
        ]}>
        <FontAwesome6 name="magnifying-glass" size={26} color="white" />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TelaLocalizacaoCli', { irParaHome: true })}
        style={({ pressed }) => [
          pressed && { transform: [{ scale: 1.5 }], opacity: 0.4 },
        ]}>
        <MaterialCommunityIcons name="google-maps" size={30} color="white" />
      </Pressable>

      <Pressable
        onPress={() => navigation.navigate('TelaPerfilCliente')}
      >
        <View style={styles.preview}>
          <Image
            source={{ uri: fotoPerfil || undefined }}
            style={[
              styles.fotoAvatar,
              { opacity: fotoPerfil ? 1 : 0 },
            ]}
            fadeDuration={0}
          />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  rodape: {
    height: 60,
    backgroundColor: '#983cff',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    padding: 10,
  },
  preview: {
    width: 40,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 50,
    overflow: 'hidden',
  },
  fotoAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },
  msg: {
    position: 'absolute',
    bottom: 70,
    alignSelf: 'center',
    color: 'yellow',
    fontSize: 14,
    backgroundColor: '#7a00ff',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 5,
  },
});

export default FooterCliente;