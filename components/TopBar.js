import { View, StyleSheet, Pressable, Image } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Header = ({ navigation, onBackPress }) => {
  const handleBack = () => {
    if (onBackPress) {
      onBackPress(); // comportamento customizado (ex: abrir modal) — não navega
    } else {
      navigation.goBack(); // comportamento padrão
    }
  };

  return (
    <View style={styles.topo}>
      <Pressable onPress={handleBack}>{/* 👈 corrigido: chama handleBack */}
        <MaterialCommunityIcons name="arrow-left" size={28} color="white" />
      </Pressable>

      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#983cff',
    padding: 9,
    paddingTop: 22,
    paddingHorizontal: 15,
  },
  image: {
    width: 50,
    height: 50,
    alignSelf: 'center',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center', // centraliza
  },
});

export default Header;