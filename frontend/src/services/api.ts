const resolveApiBaseUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const maybeGlobal = typeof globalThis !== 'undefined' ? (globalThis as Record<string, any>) : undefined;
  const nodeProcess = maybeGlobal?.process;
  return nodeProcess?.env?.VITE_API_BASE_URL;
};

const API_BASE_URL = resolveApiBaseUrl() || 'http://localhost:4000';
const JSON_HEADERS = { 'Content-Type': 'application/json' } as const;

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
}

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 60_000) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
  });

  const result = await Promise.race([promise, timeoutPromise]);
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  return result;
};

const request = async <T>(path: string, options: RequestOptions = {}): Promise<T> => {
  const controller = new AbortController();
  const config: RequestOptions = {
    ...options,
    headers: {
      ...JSON_HEADERS,
      ...(options.headers ?? {}),
    },
    signal: controller.signal,
  };

  const fetchPromise = fetch(`${API_BASE_URL}${path}`, config).then(async (response) => {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.message ?? 'Request failed');
    }
    return data;
  });

  try {
    return await withTimeout(fetchPromise, options.timeoutMs);
  } finally {
    controller.abort();
  }
};

export const api = {
  generateIcons: <T>(payload: unknown) =>
    request<T>('/api/icons/generate', {
      method: 'POST',
      body: JSON.stringify(payload),
      timeoutMs: 90_000,
    }),
};
