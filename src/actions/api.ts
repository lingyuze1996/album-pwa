import { fetchAuthSession } from 'aws-amplify/auth';
import axios from 'axios';

async function authHeader() {
  const session = await fetchAuthSession();
  const token = session.tokens?.idToken?.toString();
  if (!token) {
    throw new Error('No authentication token available');
  }
  return { Authorization: `Bearer ${token}` };
}

const uploadSingleFile = async (
  file: File,
  headers: Record<string, string>
) => {
  const metadata = {
    name: file.name,
    size: file.size,
    type: file.type,
    lastModified: file.lastModified,
  };

  // Step 1: Initiate upload to get upload URL
  const init = await fetch('/api/upload/init', {
    method: 'POST',
    body: JSON.stringify(metadata),
    headers,
  });

  if (!init.ok) throw new Error('Failed to initiate upload');

  const { uploadUrl, id } = await init.json();

  // Step 2: Upload the file blob
  await axios.put(uploadUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  });

  // Step 3: Complete the upload
  const complete = await fetch('/api/upload/complete', {
    method: 'PUT',
    body: JSON.stringify({ id }),
    headers,
  });
  return complete.json();
};

export async function uploadFiles(files: FileList) {
  const headers = await authHeader();

  const results = await Promise.allSettled(
    Array.from(files).map((file) => uploadSingleFile(file, headers))
  );

  const errors = results.filter((res) => res.status === 'rejected');
  const successes = results.filter((res) => res.status === 'fulfilled');

  alert(
    `Successful uploads: ${successes.length} files. Failed uploads: ${errors.length} files.`
  );
}

export async function listObjects(options?: {
  page?: number;
  pageSize?: number;
  cursor?: string;
}) {
  const headers = await authHeader();

  // build query params for paging
  const params = new URLSearchParams();
  if (options?.page != null) params.append('page', String(options.page));
  if (options?.pageSize != null)
    params.append('pageSize', String(options.pageSize));
  if (options?.cursor) params.append('cursor', options.cursor);

  const url = `/api/list${params.toString() ? `?${params.toString()}` : ''}`;

  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('List failed');
  return res.json(); // expected to return { items: [...], nextCursor?: string, total?: number, ... }
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
