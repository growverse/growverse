import { ApiError } from './errors';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type Json = Record<string, unknown> | unknown[] | undefined;

export interface HttpClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: Json, init?: RequestInit): Promise<T>;
  patch<T>(path: string, body?: Json, init?: RequestInit): Promise<T>;
  del<T>(path: string, init?: RequestInit): Promise<T>;
  setAuthToken(token?: string): void;
}

export function createHttpClient(baseURL: string): HttpClient {
  let token: string | undefined;
  async function request<T>(
    method: Method,
    path: string,
    body?: Json,
    init?: RequestInit,
  ): Promise<T> {
    const headers: Record<string, string> = { Accept: 'application/json' };
    const hasBody = body !== undefined;
    if (hasBody) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(new URL(path, baseURL).toString(), {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      ...init,
    });

    const ct = res.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');
    const data: unknown = isJson ? await res.json().catch(() => undefined) : undefined;

    if (!res.ok) {
      const messageData = data as { message?: string; error?: string } | undefined;
      const msg = messageData?.message ?? messageData?.error ?? `HTTP ${res.status}`;
      throw new ApiError(msg, res.status, data);
    }
    return data as T;
  }
  return {
    get: (p, i) => request('GET', p, undefined, i),
    post: (p, b, i) => request('POST', p, b, i),
    patch: (p, b, i) => request('PATCH', p, b, i),
    del: (p, i) => request('DELETE', p, undefined, i),
    setAuthToken: (t?: string) => {
      token = t;
    },
  };
}

const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
export const http = createHttpClient(env.VITE_API_URL ?? 'http://localhost:8000');
