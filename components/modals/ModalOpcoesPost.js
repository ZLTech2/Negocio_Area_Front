import { Modal, View, Text, Pressable, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import ModalEditarPost from "./ModalEditarPost";
import ModalAdicionarPromocao from "./ModalAdicionarPromocao";
import ModalDeletarPost from "./ModalDeletarPost";

export default function ModalOpcoesPost({ visivel, fechar, post, onSalvarEdicao, onSalvarPromocao, onConfirmarDeletar }) {
  const [modalEditar, setModalEditar] = useState(false);
  const [modalPromocao, setModalPromocao] = useState(false);
  const [modalDeletar, setModalDeletar] = useState(false);

  return (
    <>
     
      <ModalEditarPost
        visivel={modalEditar}
        fechar={() => setModalEditar(false)}
        post={post}
        onSalvar={(postAtualizado) => {
          onSalvarEdicao(postAtualizado);
          setModalEditar(false);
        }}
      />

      <ModalAdicionarPromocao
        visivel={modalPromocao}
        fechar={() => setModalPromocao(false)}
        post={post}
        onSalvar={(postComPromocao) => {
          onSalvarPromocao(postComPromocao);
          setModalPromocao(false);
        }}
      />

      <ModalDeletarPost
        visivel={modalDeletar}
        fechar={() => setModalDeletar(false)}
        post={post}
        onConfirmar={() => {
          onConfirmarDeletar(post);
          setModalDeletar(false);
        }}
      />

      {/* MODAL PRINCIPAL DE OPÇÕES */}
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

              <Pressable
                style={styles.editarButton}
                onPress={() => { setModalEditar(true); fechar(); }}
              >
                <Text style={styles.editarText}>EDITAR POST</Text>
              </Pressable>

              <Pressable
                style={styles.promocaoButton}
                onPress={() => { setModalPromocao(true); fechar(); }}
              >
                <Text style={styles.promocaoText}>ADICIONAR PROMOÇÃO</Text>
              </Pressable>

              <Pressable
                style={styles.deletarButton}
                onPress={() => { setModalDeletar(true); fechar(); }}
              >
                <Text style={styles.deletarText}>DELETAR POST</Text>
              </Pressable>

              <Pressable onPress={fechar}>
                <Text style={styles.cancelarText}>Cancelar</Text>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>
    </>
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
    padding: 20,
    alignItems: "center",
    gap: 10,
  },
  editarButton: {
    backgroundColor: "#983CFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  editarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  promocaoButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  promocaoText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 13,
  },
  deletarButton: {
    backgroundColor: "#e74c3c",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  deletarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  cancelarText: {
    color: "#983CFF",
    fontSize: 13,
    marginTop: 4,
  },
});
