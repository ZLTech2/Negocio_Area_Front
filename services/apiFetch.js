import { API_BASE_URL } from '../config/api';

function joinUrl(base, path) {
  const b = String(base || '').replace(/\/+$/, '');
  const p = String(path || '').replace(/^\/+/, '');
  return `${b}/${p}`;
}

async function readBody(response) {
  const text = await response.text();
  if (!text) return { data: null, rawText: '' };
  try {
    return { data: JSON.parse(text), rawText: text };
  } catch {
    return { data: text, rawText: text };
  }
}

export async function apiFetch(path, { method = 'GET', body, token } = {}) {
  const url = joinUrl(API_BASE_URL, path);

  const headers = {
    Accept: 'application/json',
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  const { data, rawText } = await readBody(response);

  if (!response.ok) {
    const err = new Error(
      typeof data === 'string' && data.trim()
        ? data
        : `HTTP ${response.status} em ${path}`
    );
    err.status = response.status;
    err.data = data;
    err.rawText = rawText;
    throw err;
  }

  return data;
}

