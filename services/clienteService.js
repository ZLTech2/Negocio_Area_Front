import { apiFetch } from './apiFetch';

export async function buscarPerfilCliente(token) {
  return apiFetch('/clientes/me', {
    method: 'GET',
    token,
  });
}