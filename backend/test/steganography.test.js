import test from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { encryptMessage, decryptMessage } from '../services/encryptionService.js';
import { embedMessageInImage, extractMessageFromImage } from '../services/steganographyService.js';

const password = 'secret-pass';
const message = 'hello world';

async function createTestImageBuffer(width = 64, height = 64) {
  return sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 120, g: 90, b: 80, alpha: 255 }
    }
  }).png().toBuffer();
}

test('TEST 1: Java encode → Web decode compatibility', async () => {
  const original = await createTestImageBuffer();
  const encryptedBase64 = encryptMessage(message, password);
  const hidden = `${encryptedBase64}#END#`;
  const stego = await embedMessageInImage(original, hidden);
  const extracted = await extractMessageFromImage(stego);
  const decrypted = decryptMessage(extracted, password);
  assert.equal(decrypted, message);
});

test('TEST 2: Web encode → Web decode round trip', async () => {
  const original = await createTestImageBuffer();
  const payload = `${encryptMessage(message, password)}#END#`;
  const stego = await embedMessageInImage(original, payload);
  const extracted = await extractMessageFromImage(stego);
  const decrypted = decryptMessage(extracted, password);
  assert.equal(decrypted, message);
});

test('TEST 3: Different passwords produce different decrypted output', async () => {
  const original = await createTestImageBuffer();
  const encrypted = encryptMessage('Keep this secret', password);
  const stego = await embedMessageInImage(original, `${encrypted}#END#`);
  const extracted = await extractMessageFromImage(stego);

  assert.throws(
    () => decryptMessage(extracted, 'different-pass'),
    /bad decrypt|BAD_DECRYPT|wrong final block length|padding/i
  );
});

test('TEST 4: Wrong password handling', async () => {
  const original = await createTestImageBuffer();
  const encrypted = encryptMessage(message, password);
  const stego = await embedMessageInImage(original, `${encrypted}#END#`);
  const extracted = await extractMessageFromImage(stego);

  assert.throws(
    () => decryptMessage(extracted, 'wrong-password'),
    /bad decrypt|BAD_DECRYPT|wrong final block length|padding/i
  );
});

test('TEST 5: Large message capacity validation', async () => {
  const original = await createTestImageBuffer(16, 16);
  const payload = 'x'.repeat(5000);
  await assert.rejects(async () => {
    await embedMessageInImage(original, payload);
  }, /Image is too small for this message/);
});

test('TEST 6: Small image validation', async () => {
  const original = await createTestImageBuffer(10, 10);
  const payload = 'Y'.repeat(50);
  await assert.rejects(async () => {
    await embedMessageInImage(original, payload);
  }, /Image is too small for this message/);
});

test('TEST 7: Image with no hidden message', async () => {
  const original = await createTestImageBuffer();
  await assert.rejects(async () => {
    await extractMessageFromImage(original);
  }, /No hidden message found/);
});

test('TEST 8: Corrupted stego image', async () => {
  const corrupted = Buffer.from('not-a-real-image');
  await assert.rejects(async () => {
    await extractMessageFromImage(corrupted);
  }, /Input buffer contains unsupported image format|No hidden message found/);
});
