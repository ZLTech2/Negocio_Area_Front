import { Modal, View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from 'react';
import { UserContext } from '../UserContext';

export default function ModalLogoff({ visivel, fechar, navigation }) {
  const { setAuthToken, setAuthTipo, setAuthExpiresAt, setEmpresaId, limparPerfilEmpresa } = useContext(UserContext);

  const confirmarLogoff = async () => {
    await limparPerfilEmpresa();
    setAuthToken(null);
    setAuthTipo(null);
    setAuthExpiresAt(null);
    setEmpresaId(null);
    fechar();
    navigation.reset({
      index: 0,
      routes: [{ name: 'TelaLogin' }],
    });
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={fechar} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Ionicons name="log-out-outline" size={26} color="#fff" />
            <View style={{ width: 22 }} />
          </View>

          <View style={styles.content}>
            <Ionicons name="exit-outline" size={40} color="#e74c3c" style={{ marginBottom: 12 }} />
            <Text style={styles.titulo}>Sair da conta?</Text>
            <Text style={styles.descricao}>
              Você precisará fazer login novamente para acessar sua conta.
            </Text>
            <View style={styles.buttons}>
              <Pressable onPress={fechar} style={styles.cancelButton}>
                <Text style={styles.cancelText}>CANCELAR</Text>
              </Pressable>
              <Pressable onPress={confirmarLogoff} style={styles.logoutButton}>
                <Text style={styles.logoutText}>SAIR</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    backgroundColor: "#983CFF",
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 2,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#333",
  },
  descricao: {
    fontSize: 13,
    color: "#777",
    marginBottom: 24,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: "#E0E0E0",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginRight: 5,
  },
  cancelText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 13,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
    marginLeft: 5,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  });