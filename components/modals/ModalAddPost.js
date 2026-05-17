import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { useState, useContext, useRef } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../UserContext";
import { API_BASE_URL } from "../../config/api";
import { apiFetch } from "../../services/apiFetch";
import Toast from 'react-native-toast-message';


export default function ModalAddPost({ visivel, fechar, adicionar }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviandoRef = useRef(false);

  const { authToken, empresaId } = useContext(UserContext);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) setImage(result.assets[0].uri);
    
  };

  const handlePublicar = async () => {
    if(enviandoRef.current) return;
    if (!title || !price) {
      alert('Nome e valor são obrigatórios');
      return;
    }

    enviandoRef.current = true;

    setLoading(true);
    try {
      const produto = await apiFetch('/produtos', {
        method: 'POST',
        token: authToken,
        body: {
          nome: title,
          descricaoProduto: desc,
          precoProduto: parseFloat(price.replace(',', '.')),
          empresaId: empresaId,
        },
      });

      if(image){
        const formData = new FormData();
        formData.append('imagem', {uri: image, name: 'imagem.jpg', type: 'image/jpeg'});
        const resp = await fetch(`${API_BASE_URL}/produtos/${produto.id}/imagem`,{
          method: 'POST',
          headers: {Authorization: `Bearer ${authToken}`},
          body: formData,
        });
        if(!resp.ok){
          const erro = await resp.json();
          alert(erro.message || 'Imagem rejeitada');
          return;
        }
        const produtoAtualizado = await resp.json();
        adicionar(produtoAtualizado);
      }else{
        adicionar(produto);
      }

      Toast.show({type: 'success', text1: 'Produto publicado com sucesso'});
      setTitle("");
      setDesc("");
      setPrice("");
      setImage(null);
      fechar();
    } catch (err) {
      alert(err?.message || 'Erro ao publicar produto');
    } finally {
      setLoading(false);
      enviandoRef.current = false;
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>

            <View style={styles.header}>
              <TouchableOpacity onPress={fechar} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <Text style={styles.modalTitle}>Adicionar Publicação</Text>

                <Text style={styles.label}>Imagem</Text>
                <Pressable style={styles.imageBox} onPress={escolherImagem}>
                  {image ? (
                    <Image source={{ uri: image }} style={styles.previewImage} />
                  ) : (
                    <Text style={styles.imageBoxText}>Escolher arquivo</Text>
                  )}
                </Pressable>

                <Text style={styles.label}>Nome do produto</Text>
                <TextInput
                  placeholder=""
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <Text style={styles.label}>Descrição do produto</Text>
                <TextInput
                  placeholder=""
                  value={desc}
                  onChangeText={setDesc}
                  style={styles.input}
                />

                <Text style={styles.label}>Valor</Text>
                <TextInput
                  placeholder="R$ 0,00"
                  placeholderTextColor="#aaa"
                  value={price}
                  onChangeText={setPrice}
                  style={styles.input}
                  keyboardType="numeric"
                />

                <View style={styles.buttons}>
                  <Pressable onPress={fechar} style={styles.cancelButton} disabled={loading}>
                    <Text style={styles.buttonText}>CANCELAR</Text>
                  </Pressable>

                  <Pressable onPress={handlePublicar} style={styles.publishButton} disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>PUBLICAR</Text>
                    )}
                  </Pressable>
                </View>
              </View>
            </ScrollView>

          </View>
        </View>
      </KeyboardAvoidingView>
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
    width: "90%",
    borderRadius: 20,
    overflow: "hidden",
    maxHeight: "90%",
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
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: "#333",
    marginBottom: 4,
  },
  imageBox: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  imageBoxText: {
    color: "#555",
    fontSize: 14,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 9,
    marginBottom: 12,
    fontSize: 14,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: "center",
  },
  publishButton: {
    backgroundColor: "#983CFF",
    padding: 11,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});