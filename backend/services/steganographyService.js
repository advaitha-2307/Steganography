import sharp from 'sharp';

const END_MARKER = '#END#';

function getBlueChannelIndex(channels) {
  return channels >= 3 ? 2 : 0;
}

function bitStringToByteArray(bits) {
  const bytes = [];

  for (let index = 0; index + 8 <= bits.length; index += 8) {
    const slice = bits.slice(index, index + 8);
    bytes.push(parseInt(slice, 2));
  }

  return bytes;
}

function bitStringToText(bits) {
  const bytes = bitStringToByteArray(bits);
  return Buffer.from(bytes).toString('utf8');
}

export function computeRequiredBits(message) {
  return (message.length * 8) + (END_MARKER.length * 8);
}

export function createPayload(message) {
  return `${message}${END_MARKER}`;
}

export async function embedMessageInImage(imageBuffer, message) {
  const payload = createPayload(message);
  const bitStream = Array.from(payload).flatMap((char) => {
    const code = char.charCodeAt(0);
    return Array.from({ length: 8 }, (_, offset) => (code >> (7 - offset)) & 1);
  });

  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const totalPixels = width * height;

  if (bitStream.length > totalPixels) {
    throw new Error('Image is too small for this message');
  }

  const blueIndex = getBlueChannelIndex(channels);

  for (let index = 0; index < bitStream.length; index += 1) {
    const pixelOffset = index * channels + blueIndex;
    data[pixelOffset] = (data[pixelOffset] & 0xfe) | bitStream[index];
  }

  const encoded = await sharp(Buffer.from(data), {
    raw: {
      width,
      height,
      channels
    }
  }).png().toBuffer();

  return encoded;
}

export async function extractMessageFromImage(imageBuffer) {
  const { data, info } = await sharp(imageBuffer)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const blueIndex = getBlueChannelIndex(channels);
  const totalPixels = width * height;

  let bitBuffer = '';
  let decodedText = '';

  for (let pixelIndex = 0; pixelIndex < totalPixels; pixelIndex += 1) {
    const pixelOffset = pixelIndex * channels + blueIndex;
    bitBuffer += (data[pixelOffset] & 1).toString();

    while (bitBuffer.length >= 8) {
      const byteBits = bitBuffer.slice(0, 8);
      bitBuffer = bitBuffer.slice(8);
      const value = parseInt(byteBits, 2);
      const character = String.fromCharCode(value);
      decodedText += character;

      if (decodedText.endsWith(END_MARKER)) {
        break;
      }

      if (decodedText.length > 10000) {
        throw new Error('No hidden message found');
      }
    }

    if (decodedText.endsWith(END_MARKER)) {
      break;
    }
  }

  const markerIndex = decodedText.indexOf(END_MARKER);

  if (markerIndex === -1) {
    throw new Error('No hidden message found');
  }

  return decodedText.slice(0, markerIndex);
}

export async function decodeEmbeddedText(imageBuffer) {
  const extracted = await extractMessageFromImage(imageBuffer);
  if (!extracted) {
    throw new Error('No hidden message found');
  }

  return extracted;
}

export function canStoreMessage(width, height, messageLength) {
  const totalPixels = width * height;
  return totalPixels >= computeRequiredBits(messageLength ? `x`.repeat(messageLength) : '');
}

export function determineMessageCapacity(width, height) {
  return width * height;
}

export function bitsToBase64Message(bits) {
  const buffer = Buffer.from(bitStringToText(bits), 'utf8');
  return buffer.toString('base64');
}
