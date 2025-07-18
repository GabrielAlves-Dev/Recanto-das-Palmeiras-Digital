import { getCurrentUser } from './auth.service';

const BASE_URL = 'http://localhost:8080';

async function customFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  ...(options.headers && !Array.isArray(options.headers) ? options.headers as Record<string, string> : {}),
};

  const user = getCurrentUser();
  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  const config: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'Ocorreu um erro na requisição');
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  } else {
    return null as T;
  }
}

export default customFetch;