export const API_BASE = (import.meta as any).env.VITE_API_URL || ''

export async function apiPost(path: string, body: any, isJson = true) {
  const url = `${API_BASE}${path}`
  const options: RequestInit = {
    method: 'POST',
    headers: isJson ? { 'Content-Type': 'application/json' } : undefined,
    body: isJson ? JSON.stringify(body) : body,
  }
  const res = await fetch(url, options)
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `${path} failed`)
  return data
}

export async function apiUpload(path: string, formData: FormData) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, { method: 'POST', body: formData })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `${path} failed`)
  return data
}
