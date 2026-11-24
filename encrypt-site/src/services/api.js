const API_BASE = '/api';

export async function encodeImage({ imageFile, message, password }) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('message', message);
  formData.append('password', password);

  const response = await fetch(`${API_BASE}/encode`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to encrypt image');
  }

  return data;
}
