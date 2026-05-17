import { Alert } from 'react-native';

export async function buscarCEP(cep, empresa, setEmpresa) {
  const cepLimpo = cep.replace(/\D/g, '');

  if (cepLimpo.length !== 8) return;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      Alert.alert('Erro', 'CEP não encontrado');
      return;
    }

    setEmpresa({
      ...empresa,
      endereco: {
        ...empresa.endereco,
        cep: data.cep,
        rua: data.logradouro,
        bairro: data.bairro,
      },
    });
  } catch (error) {
    Alert.alert('Erro', 'Falha ao buscar CEP');
  }
}