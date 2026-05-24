import { apiFetch } from './apiFetch';
import { API_BASE_URL } from '../config/api';


export async function buscarPerfilCliente(token) {
  return apiFetch('/clientes/me', {
    method: 'GET',
    token,
  });
}

export async function salvarFotoCliente(imagemUri, authToken) {

  const formData = new FormData();

  formData.append('logo', {
    uri: imagemUri,
    name: 'perfil.jpg',
    type: 'image/jpeg',
  });

  const response = await fetch(
    `${API_BASE_URL}/clientes/me/logo`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {

    const erro = await response.text();

    console.log(erro);

    throw new Error('Erro ao salvar foto');
  }

  return response.json();
}