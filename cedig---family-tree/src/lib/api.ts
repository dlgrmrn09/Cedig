const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

type ErrorHandler = (error: ApiRequestError) => void;
let globalErrorHandler: ErrorHandler | null = null;

export function setGlobalErrorHandler(handler: ErrorHandler | null) {
  globalErrorHandler = handler;
}

export class ApiRequestError extends Error {
  public code: string;
  public status: number;
  public errors?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number, code?: string, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code || 'UNKNOWN_ERROR';
    this.errors = errors;
  }
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

export interface ApiResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
  meta?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
  };
}

function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cedig_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('cedig_refresh_token');
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  retryCount = 0,
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;

  const isFormData = options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.status === 204) {
      return {} as T;
    }

    const json = await response.json();

    if (!response.ok) {
      const errorData = json as ApiError;

      if (response.status === 401 && retryCount < 1) {
        let newToken: string | null = null;

        try {
          const freshToken = await import('./firebase');
          newToken = await freshToken.ensureFreshToken();
        } catch {
          // Firebase may not be initialized yet
        }

        if (newToken) {
          api.setToken(newToken);
          return request<T>(path, options, retryCount + 1);
        }

        const refreshedToken = await refreshToken();
        if (refreshedToken) {
          api.setToken(refreshedToken);
          return request<T>(path, options, retryCount + 1);
        }
      }

      const apiError = new ApiRequestError(
        errorData.message || `Request failed with status ${response.status}`,
        response.status,
        errorData.errors?.[0]?.message || 'API_ERROR',
        errorData.errors,
      );

      if (globalErrorHandler) {
        globalErrorHandler(apiError);
      }

      throw apiError;
    }

    return json as T;
  } catch (err) {
    clearTimeout(timeoutId);

    if (err instanceof ApiRequestError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiRequestError('Request timed out', 408, 'TIMEOUT');
    }

    if (err instanceof TypeError && err.message === 'Failed to fetch') {
      throw new ApiRequestError('Network error - unable to connect to server', 0, 'NETWORK_ERROR');
    }

    throw new ApiRequestError(
      err instanceof Error ? err.message : 'Unknown error occurred',
      0,
      'UNKNOWN_ERROR',
    );
  }
}

async function refreshToken(): Promise<string | null> {
  try {
    const storedRefreshToken = getRefreshToken();
    if (!storedRefreshToken) return null;

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefreshToken }),
    });
    if (response.ok) {
      const json = await response.json();
      const newAccessToken = json.data?.accessToken || null;
      const newRefreshToken = json.data?.refreshToken || null;
      if (newAccessToken) {
        api.setToken(newAccessToken);
      }
      if (newRefreshToken) {
        api.setRefreshToken(newRefreshToken);
      }
      return newAccessToken;
    }
  } catch {
    // ignore
  }
  return null;
}

export const api = {
  get: <T>(path: string, options?: RequestInit) =>
    request<ApiResponse<T>>(path, { method: 'GET', ...options }).then(r => r.data),

  post: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<ApiResponse<T>>(path, {
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }).then(r => r.data),

  put: <T>(path: string, body?: unknown, options?: RequestInit) =>
    request<ApiResponse<T>>(path, {
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
      ...options,
    }).then(r => r.data),

  delete: <T>(path: string, options?: RequestInit) =>
    request<ApiResponse<T>>(path, { method: 'DELETE', ...options }).then(r => r.data),

  upload: <T>(path: string, formData: FormData, options?: RequestInit) =>
    request<ApiResponse<T>>(path, {
      method: 'POST',
      body: formData,
      ...options,
    }).then(r => r.data),

  getPaginated: <T>(path: string, params?: Record<string, string | number | boolean>, options?: RequestInit) => {
    const query = params ? '?' + new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    ).toString() : '';
    return request<{ data: T[]; pagination?: PaginatedResponse<T>['pagination']; meta?: PaginatedResponse<T>['meta'] }>(path + query, { method: 'GET', ...options });
  },

  setToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cedig_token', token);
    }
  },

  setRefreshToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cedig_refresh_token', token);
    }
  },

  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cedig_token');
      localStorage.removeItem('cedig_refresh_token');
    }
  },
};
