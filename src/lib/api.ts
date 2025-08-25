export async function fetchJson<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const response = await fetch(input, init);
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Request failed: ${response.status} ${text}`);
  }
  return (await response.json()) as T;
}

export function getApiBaseUrl(): string {
  // In dev, Vite proxy forwards /api to backend; in prod, serve same origin
  return "/api";
}

