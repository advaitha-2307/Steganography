import sharp from 'sharp';
import { encryptMessage, decryptMessage } from '../services/encryptionService.js';
import { embedMessageInImage, decodeEmbeddedText } from '../services/steganographyService.js';
import { validateEncodeInput, validateDecodeInput, validateFileSize } from '../utils/validation.js';

export async function encodeMessage(req, res) {
  try {
    const file = req.file;
    const { message, password } = req.body;

    validateEncodeInput({ image: file, message, password });
    validateFileSize(file);

    const imageMetadata = await sharp(file.buffer).metadata();
    const rawMessage = String(message).trim();
    const encrypted = encryptMessage(rawMessage, password);

    const stegoBuffer = await embedMessageInImage(file.buffer, encrypted);

    res.status(200).json({
      success: true,
      stegoImage: `data:image/png;base64,${stegoBuffer.toString('base64')}`,
      metadata: {
        width: imageMetadata.width,
        height: imageMetadata.height,
        format: imageMetadata.format,
        size: file.size,
        outputFormat: 'png'
      }
    });
  } catch (error) {
    const errorMessage = error.message || 'Failed to process image';
    res.status(400).json({ success: false, error: errorMessage });
  }
}

export async function decodeMessage(req, res) {
  try {
    const file = req.file;
    const { password } = req.body;

    validateDecodeInput({ image: file, password });
    validateFileSize(file);

    const extractedBase64 = await decodeEmbeddedText(file.buffer);

    try {
      const decrypted = decryptMessage(extractedBase64, password);
      res.status(200).json({
        success: true,
        message: decrypted
      });
    } catch (decryptError) {
      res.status(400).json({
        success: false,
        error: 'Incorrect password or corrupted image.'
      });
    }
  } catch (error) {
    const errorMessage = error.message || 'Failed to process image';
    res.status(400).json({ success: false, error: errorMessage });
  }
}
