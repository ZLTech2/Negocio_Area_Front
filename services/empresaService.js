import { apiFetch } from './apiFetch';

export async function buscarPerfilEmpresa(token) {
  return apiFetch('/empresas/me', {
    method: 'GET',
    token,
  });
}

export async function atualizarPerfilEmpresa(data, token) {
  return apiFetch('/empresas', {
    method: 'PUT',
    token,
    body: data,
  });
}

export async function buscarTodasEmpresas(){
  return apiFetch(`/empresas`,{
    method: 'GET',
  })
}