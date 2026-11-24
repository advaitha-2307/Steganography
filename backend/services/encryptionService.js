import crypto from 'crypto';

export function deriveAesKey(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password cannot be empty');
  }

  const digest = crypto.createHash('sha1').update(password, 'utf8').digest();
  return digest.subarray(0, 16);
}

export function encryptMessage(message, password) {
  const key = deriveAesKey(password);
  const cipher = crypto.createCipheriv('aes-128-ecb', key, null);

  const payload = Buffer.from(message, 'utf8');
  const encrypted = Buffer.concat([cipher.update(payload), cipher.final()]);

  return encrypted.toString('base64');
}

export function decryptMessage(encryptedBase64, password) {
  const key = deriveAesKey(password);
  const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);

  const payload = Buffer.from(encryptedBase64, 'base64');
  const decrypted = Buffer.concat([decipher.update(payload), decipher.final()]);
  return decrypted.toString('utf8');
}

export function deriveJavaCompatibleAesKey(password) {
  return deriveAesKey(password);
}
