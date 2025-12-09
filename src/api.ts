import { fetchAuthSession } from 'aws-amplify/auth';

async function authHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) {
    throw new Error('No authentication token available');
  }
  return { Authorization: `Bearer ${token}` };
}

export async function uploadFile(file: File) {
  const fd = new FormData();
  fd.append('file', file, file.name);
  const headers = await authHeader();
  const res = await fetch('/api/upload', { method: 'POST', body: fd, headers });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function listObjects() {
  const headers = await authHeader();
  const res = await fetch('/api/list', { headers });
  if (!res.ok) throw new Error('List failed');
  return res.json();
}

export function getObjectUrl(key: string) {
  return `/api/get?key=${encodeURIComponent(key)}`;
}

export async function deleteObject(key: string) {
  const headers = await authHeader();
  const res = await fetch(`/api/delete?key=${encodeURIComponent(key)}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Delete failed');
  return res.json();
}
