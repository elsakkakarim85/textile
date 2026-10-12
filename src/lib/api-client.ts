/** Tiny JSON client for cluster module forms. Throws Error(message) on non-2xx. */
export async function api<T = unknown>(url: string, method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET', body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const details = data?.details && typeof data.details === 'object'
      ? ' — ' + Object.entries(data.details).map(([k, v]) => `${k}: ${(v as string[]).join(', ')}`).join('; ')
      : '';
    throw new Error((data?.error || `Request failed (${res.status})`) + details);
  }
  return data as T;
}
