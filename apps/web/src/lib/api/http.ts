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

    const url = baseURL.startsWith('http')
      ? new URL(path, baseURL).toString()
      : `${baseURL.replace(/\/$/, '')}${path}`;
    const res = await fetch(url, {
      method,
      headers,
      body: hasBody ? JSON.stringify(body) : undefined,
      mode: 'cors',
      ...init,
    });

    const ct = res.headers.get('content-type') || '';
    const isJson = ct.includes('application/json');
    const data: unknown = isJson ? await res.json().catch(() => undefined) : undefined;

    if (!res.ok) {
      const messageData = data as
        | {
            message?: string;
            error?: string | { message?: string };
          }
        | undefined;
      let msg: string | undefined;
      if (typeof messageData?.message === 'string') msg = messageData.message;
      else if (typeof messageData?.error === 'string') msg = messageData.error;
      else if (
        messageData &&
        typeof messageData.error === 'object' &&
        messageData.error !== null &&
        'message' in messageData.error
      )
        msg = (messageData.error as { message?: string }).message;
      throw new ApiError(msg ?? `HTTP ${res.status}`, res.status, data);
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
export const http = createHttpClient(env.VITE_API_URL ?? '/api');
