const API_BASE = '/api';

export async function decodeImage({ imageFile, password }) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('password', password);

  const response = await fetch(`${API_BASE}/decode`, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Incorrect password or corrupted image.');
  }

  return data;
}

