export function isAllowedImageType(mimeType) {
  return [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/bmp',
    'image/webp'
  ].includes(mimeType);
}

export function validateEncodeInput({ image, message, password }) {
  if (!image) {
    throw new Error('No image selected');
  }

  if (!image.mimetype || !isAllowedImageType(image.mimetype)) {
    throw new Error('Invalid image format');
  }

  if (!message || !String(message).trim()) {
    throw new Error('Message cannot be empty');
  }

  if (!password || !String(password).trim()) {
    throw new Error('Password cannot be empty');
  }
}

export function validateDecodeInput({ image, password }) {
  if (!image) {
    throw new Error('No image selected');
  }

  if (!image.mimetype || !isAllowedImageType(image.mimetype)) {
    throw new Error('Invalid image format');
  }

  if (!password || !String(password).trim()) {
    throw new Error('Password cannot be empty');
  }
}

export function validateFileSize(file, maxBytes = 10 * 1024 * 1024) {
  if (!file) {
    return;
  }

  if (file.size > maxBytes) {
    throw new Error('Image is too large');
  }
}
