import { apiFetch } from './apiFetch';

export async function getMeuCupom(token) {
  return apiFetch('/cupons/meu', {
    method: 'GET',
    token,
  });
}

export async function usarCupom(empresaId, token) {
  return apiFetch('/cupons/usar', {
    method: 'POST',
    body: { empresaId },
    token,
  });
}