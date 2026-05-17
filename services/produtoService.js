import { apiFetch } from './apiFetch';

export async function buscarProdutosEmpresa(token) {
  return apiFetch('/produtos/minhaEmpresa', {
    method: 'GET',
    token,
  });
}

export async function buscarTodosProdutos(){
  return apiFetch('/produtos',{
    method: 'GET',
  });
}

export async function buscarProdutosPorEmpresa(empresaId) {
  return apiFetch(`/produtos/empresa/${empresaId}`, {
    method: 'GET',
  });
}

export async function adicionarPromocao(produtoId, dados, token) {
  return apiFetch(`/produtos/${produtoId}/promocao`, {
    method: 'PUT',
    token,
    body: dados,
  });
}

export async function removerPromocao(produtoId, token) {
  return apiFetch(`/produtos/${produtoId}/promocao`, {
    method: 'DELETE',
    token,
  });
}