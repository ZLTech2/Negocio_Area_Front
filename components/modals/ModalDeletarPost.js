import { Modal, View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { apiFetch } from "../../services/apiFetch";
import { ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';


export default function ModalDeletarPost({ visivel, fechar, onConfirmar, post }) {
  const [loading, setLoading] = useState(false);
  const {authToken} = useContext(UserContext);
  const handleDeletar = async()=>{
    setLoading(true);
    try{
      await apiFetch(`/produtos/${post.id}`,{
        method: 'DELETE',
        token: authToken,
      });
      onConfirmar();
      Toast.show({type: 'success', text1: 'Produto deletado com sucesso'});
      fechar();
    }catch(err){
      alert(err?.message || 'Erro ao deletar produto');
    }finally{
      setLoading(false);
    }
  }
  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* HEADER ROXO */}
          <View style={styles.header}>
            <TouchableOpacity onPress={fechar} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ width: 22 }} />
          </View>

          {/* CONTEÚDO */}
          <View style={styles.content}>
            <Ionicons name="trash-outline" size={40} color="#e74c3c" style={{ marginBottom: 12 }} />
            <Text style={styles.titulo}>Deletar publicação?</Text>
            <Text style={styles.descricao}>Esta ação não pode ser desfeita.</Text>

            <View style={styles.buttons}>
              <Pressable onPress={fechar} style={styles.cancelButton}>
                <Text style={styles.buttonText}>CANCELAR</Text>
              </Pressable>

              <Pressable onPress={handleDeletar} style={styles.deletarButton} disabled={loading}>
  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>DELETAR</Text>}
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
    gap: 10,
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "#983CFF",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  deletarButton: {
    backgroundColor: "#e74c3c",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
