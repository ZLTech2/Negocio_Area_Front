import { Modal, View, Text, TextInput, Pressable, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useState } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";

export default function ModalAdicionarPromocao({ visivel, fechar, post, onSalvar }) {
  const [valorPromocional, setValorPromocional] = useState("");
  const [porcentagem, setPorcentagem] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [layoutAtivo, setLayoutAtivo] = useState(false);
  const [imagemLayout, setImagemLayout] = useState(null);

  const escolherImagemLayout = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagemLayout(result.assets[0].uri);
    }
  };

  const handleSalvar = () => {
    onSalvar({
      ...post,
      promocao: {
        valorPromocional,
        porcentagem,
        dataFinal,
        layoutAtivo,
        imagemLayout,
      }
    });
    fechar();
  };

  const handleFechar = () => {
    setValorPromocional("");
    setPorcentagem("");
    setDataFinal("");
    setLayoutAtivo(false);
    setImagemLayout(null);
    fechar();
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.overlay}>
          <View style={styles.container}>

            {/* HEADER ROXO */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleFechar} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.content}>
                <Text style={styles.modalTitle}>Adicionar promoção</Text>

                {/* VALOR PROMOCIONAL */}
                <Text style={styles.label}>Valor do produto promocional</Text>
                <TextInput
                  placeholder="R$ 0,00"
                  placeholderTextColor="#aaa"
                  value={valorPromocional}
                  onChangeText={setValorPromocional}
                  style={styles.input}
                  keyboardType="numeric"
                />

                {/* PORCENTAGEM */}
                <Text style={styles.label}>Porcentagem do desconto</Text>
                <TextInput
                  placeholder="0%"
                  placeholderTextColor="#aaa"
                  value={porcentagem}
                  onChangeText={setPorcentagem}
                  style={styles.input}
                  keyboardType="numeric"
                />

                {/* DATA FINAL */}
                <Text style={styles.label}>Data final da promoção</Text>
                <TextInput
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#aaa"
                  value={dataFinal}
                  onChangeText={setDataFinal}
                  style={styles.input}
                />

                {/* CHECKBOX LAYOUT PROMOCIONAL */}
                <Pressable
                  style={styles.checkboxRow}
                  onPress={() => setLayoutAtivo(!layoutAtivo)}
                >
                  <View style={[styles.checkbox, layoutAtivo && styles.checkboxAtivo]}>
                    {layoutAtivo && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Adicionar layout promocional</Text>
                </Pressable>

                {/* PREVIEW DE IMAGEM DO LAYOUT */}
                {layoutAtivo && (
                  <Pressable style={styles.imageBox} onPress={escolherImagemLayout}>
                    {imagemLayout ? (
                      <Image source={{ uri: imagemLayout }} style={styles.previewImage} />
                    ) : (
                      <Text style={styles.imageBoxText}>Escolher imagem do layout</Text>
                    )}
                  </Pressable>
                )}

                {/* BOTÕES */}
                <View style={styles.buttons}>
                  <Pressable onPress={handleFechar} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>CANCELAR</Text>
                  </Pressable>

                  <Pressable onPress={handleSalvar} style={styles.publishButton}>
                    <Text style={styles.buttonText}>PUBLICAR</Text>
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 9,
    marginBottom: 12,
    fontSize: 14,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#983CFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxAtivo: {
    backgroundColor: "#983CFF",
  },
  checkboxLabel: {
    fontSize: 13,
    color: "#333",
  },
  imageBox: {
    backgroundColor: "#D9D9D9",
    borderRadius: 8,
    height: 120,
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
