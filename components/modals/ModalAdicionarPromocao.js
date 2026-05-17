import {
  Modal, View, Text, TextInput, Pressable, StyleSheet,
  TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useState, useContext } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from '../UserContext';
import { adicionarPromocao } from '../../services/produtoService';

export default function ModalAdicionarPromocao({ visivel, fechar, post, onSalvar }) {
  const [porcentagem, setPorcentagem] = useState('');
  const [dataFinal, setDataFinal] = useState('');
  const [layoutAtivo, setLayoutAtivo] = useState(false);
  const [loading, setLoading] = useState(false);

  const { authToken } = useContext(UserContext);

  const formatarData = (texto) => {
    const numeros = texto.replace(/\D/g, '').slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
  };

  const valorPromocional = porcentagem
    ? (post?.precoProduto - (post?.precoProduto * parseFloat(porcentagem)) / 100).toFixed(2)
    : '';

  const handleSalvar = async () => {
    if (!porcentagem || !dataFinal) {
      alert('Preencha a porcentagem e a data final');
      return;
    }

    const partes = dataFinal.split('/');
    if (partes.length !== 3 || partes[0].length !== 2 || partes[1].length !== 2 || partes[2].length !== 4) {
      alert('Data inválida. Use o formato DD/MM/AAAA');
      return;
    }

    const [dia, mes, ano] = partes;
    const dataFormatada = `${ano}-${mes}-${dia}`;

    setLoading(true);
    try {
      const produtoAtualizado = await adicionarPromocao(
        post.id,
        {
          porcentagemDesconto: parseFloat(porcentagem),
          dataFinalPromocao: dataFormatada,
          gerarBanner: layoutAtivo,
        },
        authToken
      );
      onSalvar(produtoAtualizado);
      handleFechar();
    } catch (err) {
      alert(err?.message || 'Erro ao adicionar promoção');
    } finally {
      setLoading(false);
    }
  };

  const handleFechar = () => {
    setPorcentagem('');
    setDataFinal('');
    setLayoutAtivo(false);
    fechar();
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <View style={styles.header}>
              <TouchableOpacity onPress={handleFechar} style={styles.backButton}>
                <Ionicons name="arrow-back" size={22} color="#fff" />
              </TouchableOpacity>
              <View style={{ width: 22 }} />
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <View style={styles.content}>
                <Text style={styles.modalTitle}>Adicionar promoção</Text>

                <Text style={styles.label}>Valor original</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f5f5f5', color: '#999' }]}
                  value={`R$ ${post?.precoProduto?.toFixed(2)}`}
                  editable={false}
                />

                <Text style={styles.label}>Porcentagem de desconto</Text>
                <TextInput
                  placeholder="0%"
                  placeholderTextColor="#aaa"
                  value={porcentagem}
                  onChangeText={setPorcentagem}
                  style={styles.input}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Valor promocional</Text>
                <TextInput
                  style={[styles.input, { backgroundColor: '#f5f5f5', color: '#999' }]}
                  value={valorPromocional ? `R$ ${valorPromocional}` : ''}
                  editable={false}
                  placeholder="Calculado automaticamente"
                  placeholderTextColor="#aaa"
                />

                <Text style={styles.label}>Data final da promoção</Text>
                <TextInput
                  placeholder="DD/MM/AAAA"
                  placeholderTextColor="#aaa"
                  value={dataFinal}
                  onChangeText={(texto) => setDataFinal(formatarData(texto))}
                  style={styles.input}
                  keyboardType="numeric"
                />

                <Pressable style={styles.checkboxRow} onPress={() => setLayoutAtivo(!layoutAtivo)}>
                  <View style={[styles.checkbox, layoutAtivo && styles.checkboxAtivo]}>
                    {layoutAtivo && <Ionicons name="checkmark" size={14} color="#fff" />}
                  </View>
                  <Text style={styles.checkboxLabel}>Gerar card de destaque com IA</Text>
                </Pressable>

                {layoutAtivo && (
                  <View style={styles.bannerInfo}>
                    <Ionicons name="color-wand-outline" size={24} color="#983CFF" />
                    <Text style={styles.bannerInfoText}>
                      A IA vai gerar um texto criativo de divulgação que aparece sobre a imagem do produto no feed
                    </Text>
                  </View>
                )}

                <View style={styles.buttons}>
                  <Pressable onPress={handleFechar} style={styles.cancelButton} disabled={loading}>
                    <Text style={styles.buttonText}>CANCELAR</Text>
                  </Pressable>
                  <Pressable onPress={handleSalvar} style={styles.publishButton} disabled={loading}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>PUBLICAR</Text>}
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
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { backgroundColor: '#fff', width: '90%', borderRadius: 20, overflow: 'hidden', maxHeight: '90%' },
  header: { backgroundColor: '#983CFF', paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { padding: 2 },
  content: { padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  label: { fontSize: 13, color: '#333', marginBottom: 4 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 9, marginBottom: 12, fontSize: 14 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1.5, borderColor: '#983CFF', borderRadius: 4, justifyContent: 'center', alignItems: 'center' },
  checkboxAtivo: { backgroundColor: '#983CFF' },
  checkboxLabel: { fontSize: 13, color: '#333' },
  bannerInfo: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f3e8ff', borderRadius: 8, padding: 12, marginBottom: 14, gap: 10 },
  bannerInfoText: { color: '#983CFF', fontSize: 13, flex: 1 },
  buttons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 },
  cancelButton: { backgroundColor: '#e74c3c', padding: 11, borderRadius: 8, flex: 1, marginRight: 6, alignItems: 'center' },
  publishButton: { backgroundColor: '#983CFF', padding: 11, borderRadius: 8, flex: 1, marginLeft: 6, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
});