import authService from './auth.service';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

async function customFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const user = authService.getCurrentUser();
  const headers: Record<string, string> = {};

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  if (user && user.token) {
    headers['Authorization'] = `Bearer ${user.token}`;
  }

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...(options.headers && !Array.isArray(options.headers) ? (options.headers as Record<string, string>) : {}),
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    const errorMessage = Array.isArray(errorData.messages) ? errorData.messages.join(' ') : errorData.message;
    throw new Error(errorMessage || 'Ocorreu um erro na requisição');
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    return response.json() as Promise<T>;
  } else {
    return null as T;
  }
}

export default customFetch;
