import { View, Text, StyleSheet } from 'react-native';

export default function Card() {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Produto</Text>
      <Text>Descrição aqui</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});