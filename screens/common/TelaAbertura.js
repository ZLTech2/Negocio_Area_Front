import { Image, StyleSheet, View } from 'react-native';
import ImageBackgroundDesf from '../../components/ImageBackgroundDesf'
import React, {useEffect} from 'react';

const TelaInicial = ({navigation}) => {
  useEffect(()=>{
    const tempo = async()=>{
      await new Promise(resolve=>setTimeout(resolve,2000))
      navigation.replace('TelaLogin');
    }

    tempo();
  },[]);

  return (
        <ImageBackgroundDesf>
          <View style={estilos.container}>
            <Image source={require('../../assets/images/logord.png')} style={estilos.imagem} />
          </View>
        </ImageBackgroundDesf>
  );
};
const estilos = StyleSheet.create({
  container: {
    flex: 1,               
    justifyContent: 'center', 
    alignItems: 'center',    
  },
  imagem: {
    justifyContent: 'center',
    height: 150,
    width: 150,
   
  }
});
export default TelaInicial;