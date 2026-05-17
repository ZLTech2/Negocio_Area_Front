import { StyleSheet, ImageBackground, View } from 'react-native';

const ImageBackgroundDesf = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/images/imageBackgroundDesf.png')}
      style={styles.imageBackground}>
      <View style={styles.overlay}>
        {children}
      </View>
    </ImageBackground>
  );
};

export default ImageBackgroundDesf;

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});