const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const config = {
    method: options.method || 'GET',
    headers: options.headers || {},
    ...options
  };

  if (!(config.body instanceof FormData)) {
    config.headers = {
      ...config.headers,
      'Content-Type': 'application/json'
    };
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export async function encodeImage({ imageFile, message, password }) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('message', message);
  formData.append('password', password);

  return request('/encode', {
    method: 'POST',
    body: formData
  });
}

export async function decodeImage({ imageFile, password }) {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('password', password);

  return request('/decode', {
    method: 'POST',
    body: formData
  });
}
