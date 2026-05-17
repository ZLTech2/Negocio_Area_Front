import {
  Modal, View, Text, TextInput, Pressable,
  StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator
} from "react-native";
import { useState, useEffect, useContext } from "react";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from '../UserContext';
import { API_BASE_URL } from '../../config/api';
import Toast from 'react-native-toast-message';

const CORES = ['#e74c3c', '#2ecc71', '#e91e8c', '#333333', '#6b6b2a', '#2c3e7a', '#f0a500'];

const CLOUDINARY_CLOUD_NAME = 'dzqt0re7t';
const CLOUDINARY_UPLOAD_PRESET = 'negocionaarea';

// Faz upload da imagem diretamente para o Cloudinary e retorna a secure_url
async function uploadCloudinary(uri) {
  const formData = new FormData();
  formData.append('file', { uri, name: 'logo.jpg', type: 'image/jpeg' });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!response.ok) throw new Error('Falha no upload da imagem para o Cloudinary');
  const data = await response.json();
  return data.secure_url;
}

async function salvarLogoNaApi(cloudinaryUrl, authToken) {
  const formData = new FormData();
  formData.append('logo', { uri: cloudinaryUrl, name: 'logo.jpg', type: 'image/jpeg' });

  const response = await fetch(`${API_BASE_URL}/empresas/me/logo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${authToken}` },
    body: formData,
  });

  if (!response.ok) {
    const erro = await response.json().catch(() => ({}));
    throw new Error(erro.message || 'Erro ao salvar logo na API');
  }

  return response.json();
}

export default function ModalEditarPerfil({ visivel, fechar, perfil, onSalvar }) {
  const { authToken, setFotoPerfilEmpresa } = useContext(UserContext);
  const [nomeLoja, setNomeLoja] = useState("");
  const [descricao, setDescricao] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [fotoFundo, setFotoFundo] = useState(null);
  const [corSelecionada, setCorSelecionada] = useState(null);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (perfil) {
      setNomeLoja(perfil.nomeLoja || "");
      setDescricao(perfil.descricao || "");
      setFotoPerfil(perfil.fotoPerfil || null);
      setFotoFundo(perfil.fotoFundo || null);
      setCorSelecionada(perfil.cor || null);
    }
  }, [perfil, visivel]);

  const escolherFoto = async (tipo) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: tipo === 'perfil' ? [1, 1] : [16, 9],
      quality: 1,
    });
    if (!result.canceled) {
      if (tipo === 'perfil') setFotoPerfil(result.assets[0].uri);
      else setFotoFundo(result.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      let logoUrlFinal = fotoPerfil;

      
      const fotoEhLocal = fotoPerfil && !fotoPerfil.startsWith('http');

      if (fotoEhLocal) {
        const cloudinaryUrl = await uploadCloudinary(fotoPerfil);

        try {
          const data = await salvarLogoNaApi(cloudinaryUrl, authToken);
          logoUrlFinal = data.logoUrl
            ? (data.logoUrl.startsWith('http') ? data.logoUrl : `${API_BASE_URL}${data.logoUrl}`)
            : cloudinaryUrl;
        } catch (apiErr) {
          console.log('Aviso: API não persistiu logo via multipart, usando URL Cloudinary:', apiErr.message);
          logoUrlFinal = cloudinaryUrl;
        }

        setFotoPerfilEmpresa(logoUrlFinal);
      }

      if (nomeLoja || descricao) {
        await fetch(`${API_BASE_URL}/empresas/me`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nome: nomeLoja, descricao }),
        });
      }

      onSalvar({
        nomeLoja,
        descricao,
        fotoPerfil: logoUrlFinal,
        fotoFundo,
        cor: corSelecionada,
      });
      Toast.show({ type: 'success', text1: 'Perfil atualizado com sucesso' });
      fechar();
    } catch (err) {
      console.log('Erro ao salvar perfil:', err);
      Toast.show({ type: 'error', text1: 'Erro ao salvar perfil', text2: err.message });
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>

          <View style={styles.header}>
            <TouchableOpacity onPress={fechar} style={styles.backButton}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View style={{ width: 22 }} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>

              <View style={styles.secao}>
                <Text style={styles.secaoTitulo}>Informações</Text>
                <TextInput
                  placeholder="Nome da Loja"
                  placeholderTextColor="#999"
                  value={nomeLoja}
                  onChangeText={setNomeLoja}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Descrição da Loja"
                  placeholderTextColor="#999"
                  value={descricao}
                  onChangeText={setDescricao}
                  style={styles.input}
                />

                <Text style={styles.secaoTitulo}>Visual</Text>
                <View style={styles.fotosRow}>
                  <Pressable style={styles.fotoBtn} onPress={() => escolherFoto('perfil')}>
                    {fotoPerfil
                      ? <Image source={{ uri: fotoPerfil }} style={styles.fotoPreview} />
                      : <Text style={styles.fotoBtnText}>Foto Perfil</Text>
                    }
                  </Pressable>

                  <Pressable style={styles.fotoBtn} onPress={() => escolherFoto('fundo')}>
                    {fotoFundo
                      ? <Image source={{ uri: fotoFundo }} style={styles.fotoPreview} />
                      : <Text style={styles.fotoBtnText}>Foto Fundo</Text>
                    }
                  </Pressable>
                </View>

                <Text style={styles.secaoTitulo}>Cor perfil</Text>
                <View style={styles.coresRow}>
                  {CORES.map((cor) => (
                    <Pressable
                      key={cor}
                      onPress={() => setCorSelecionada(cor)}
                      style={[
                        styles.bolinha,
                        { backgroundColor: cor },
                        corSelecionada === cor && styles.bolinhaAtiva,
                      ]}
                    />
                  ))}
                </View>
              </View>

              {salvando ? (
                <ActivityIndicator size="large" color="#983CFF" style={{ marginBottom: 16 }} />
              ) : (
                <Pressable style={styles.salvarButton} onPress={handleSalvar}>
                  <Text style={styles.salvarText}>SALVAR ALTERAÇÕES</Text>
                </Pressable>
              )}

              <Pressable onPress={fechar}>
                <Text style={styles.cancelarText}>Cancelar</Text>
              </Pressable>
            </View>
          </ScrollView>
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
  backButton: { padding: 2 },
  content: { padding: 20 },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  secao: {
    borderWidth: 1.5,
    borderColor: "#6ab0f5",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  secaoTitulo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 10,
    marginTop: 6,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  fotosRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  fotoBtn: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  fotoBtnText: {
    color: "#555",
    fontSize: 13,
    fontWeight: "500",
  },
  fotoPreview: {
    width: "100%",
    height: "100%",
  },
  coresRow: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    marginTop: 4,
  },
  bolinha: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  bolinhaAtiva: {
    borderWidth: 3,
    borderColor: "#6ab0f5",
  },
  salvarButton: {
    backgroundColor: "#983CFF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  salvarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  cancelarText: {
    color: "#e74c3c",
    textAlign: "center",
    fontSize: 14,
    marginBottom: 4,
  },
});