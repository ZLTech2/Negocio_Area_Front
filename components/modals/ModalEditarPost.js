import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useState, useEffect, useContext } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../UserContext';
import { apiFetch } from '../../services/apiFetch';
import { ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';


const CLOUDINARY_CLOUD_NAME = 'dzqt0re7t';
const CLOUDINARY_UPLOAD_PRESET = 'negocionaarea';

async function uploadCloudinary(uri) {
  const formData = new FormData();
  formData.append('file', { uri, name: 'imagem.jpg', type: 'image/jpeg' });
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );
  if (!response.ok) throw new Error('Falha no upload da imagem');
  const data = await response.json();
  return data.secure_url;
}

export default function ModalEditarPost({ visivel, fechar, post, onSalvar }) {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(null);

  const { authToken } = useContext(UserContext);

  // Preenche os campos com os dados do post quando o modal abre
  useEffect(() => {
    if (visivel && post) {
      setTitle(post.nome || '');
      setDesc(post.descricaoProduto || '');
      setPrice(post.precoProduto?.toString() || '');
      setImage(post.imagem || null);
    }
  }, [visivel]);

  const escolherImagem = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSalvar = async () => {
    if (!title || !price) {
      alert('Nome e valor são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      let imagemUrl = post.imagem;
      if (image && image !== post.imagem) {
        imagemUrl = await uploadCloudinary(image);
      }

      const atualizado = await apiFetch(`/produtos/${post.id}`, {
        method: 'PATCH',
        token: authToken,
        body: {
          nome: title,
          descricaoProduto: desc,
          precoProduto: parseFloat(price.replace(',', '.')),
          imagem: imagemUrl, // ← Cloudinary URL ou a existente
        },
      });

      onSalvar(atualizado);
          Toast.show({type: 'success', text1: 'Produto editado com sucesso'});
      fechar();
    } catch (err) {
      alert(err?.message || 'Erro ao editar produto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            {/* HEADER ROXO */}
            <View style={styles.header}>
              <TouchableOpacity onPress={fechar} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <Text style={styles.modalTitle}>Editar Publicação</Text>

                {/* ÁREA DE IMAGEM */}
                <Text style={styles.label}>Imagem</Text>
                <Pressable style={styles.imageBox} onPress={escolherImagem}>
                  {image ? (
                    <Image
                      source={{ uri: image }}
                      style={styles.previewImage}
                    />
                  ) : (
                    <Text style={styles.imageBoxText}>Escolher arquivo</Text>
                  )}
                </Pressable>

                {/* INPUTS */}
                <Text style={styles.label}>Nome do produto</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.input}
                />

                <Text style={styles.label}>Descrição do produto</Text>
                <TextInput
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

                {/* BOTÕES */}
                <View style={styles.buttons}>
                  <Pressable onPress={fechar} style={styles.cancelButton}>
                    <Text style={styles.buttonText}>CANCELAR</Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSalvar}
                    style={styles.publishButton}
                    disabled={loading}>
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>SALVAR</Text>
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  header: {
    backgroundColor: '#983CFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 2,
  },
  content: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: '#333',
    marginBottom: 4,
  },
  imageBox: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  imageBoxText: {
    color: '#555',
    fontSize: 14,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 9,
    marginBottom: 12,
    fontSize: 14,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  publishButton: {
    backgroundColor: '#983CFF',
    padding: 11,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
});
