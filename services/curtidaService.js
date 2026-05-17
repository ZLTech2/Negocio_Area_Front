// services/curtidaService.js
import { apiFetch } from './apiFetch';

export function alternarCurtida(produtoId, token) {
  return apiFetch(`/curtidas/produto/${produtoId}`, {
    method: 'POST',
    token,
  });
}

export async function getFeedCurtidas(token) {
  return apiFetch('/curtidas/feed', {
    method: 'GET',
    token,
  });
}

export function obterStatusCurtida(produtoId, token) {
  return apiFetch(`/curtidas/produto/${produtoId}/status`, {
    method: 'GET',
    token,
  });
}