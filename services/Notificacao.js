import { apiFetch } from './apiFetch';

// Recebe o token por parâmetro, igual ao padrão do restante do projeto
export async function salvarPreferenciasNotificacao(dados, token) {
  return apiFetch('/notificacao/configuracao', {
    method: 'POST',
    body: dados,
    token,
  });
}