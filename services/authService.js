import {apiFetch} from './apiFetch';

export async function loginEmpresa(email, senha){
  return apiFetch('/auth/login/empresa',{
    method: 'POST',
    body:{
      email: String(email).trim().toLowerCase(),
      senha: String(senha),
    },
  });
}

export async function cadastrarEmpresa(payload){
  return apiFetch('/empresas',{
    method: 'POST',
    body: payload,
  });
}

export async function loginCliente(email, senha){
  return apiFetch('/auth/login/cliente',{
    method: 'POST',
    body:{
      email: String(email).trim().toLowerCase(),
      senha: String(senha),
    },
  });
}

export async function cadastrarCliente(payload){
  return apiFetch('/clientes',{
    method: 'POST',
    body: payload,
  });
}

export async function login(email, senha){
  return apiFetch('/auth/login/auto',{
    method:'POST',
    body:{
      email: String(email).trim().toLowerCase(),
      senha: String(senha),
    },
  });
}