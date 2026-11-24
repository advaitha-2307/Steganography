# Image Steganography Tool with AES Security

This project converts the original Java Swing desktop application into a modern web application while preserving the same core algorithm:

- AES encryption with SHA-1(password) -> first 16 bytes as key
- Base64 representation of the encrypted payload
- Blue-channel least-significant-bit (LSB) embedding
- `#END#` terminator marker
- PNG output for compatibility and no lossy compression

## Prerequisites

- Node.js 18+
- npm 9+

## Installation

```bash
cd backend
npm install
cd ../frontend
npm install
```

## Backend setup

The backend performs AES encryption/decryption and LSB steganography in memory.

```bash
cd backend
npm install
npm start
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev -- --host 0.0.0.0
```

## How to run

Open two terminals:

Terminal 1:
```bash
cd backend
npm start
```

Terminal 2:
```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

Then open:

```text
http://localhost:5173
```

## How to use Encode

1. Upload an image.
2. Enter a secret message.
3. Enter a password.
4. Click "Encrypt & Hide Message".
5. Download the generated PNG stego image.

## How to use Decode

1. Upload a stego image.
2. Enter the same password used during encoding.
3. Click "Extract & Decrypt Message".
4. The original message is displayed.

## API documentation

### POST /api/encode

Multipart form-data:

- image: image file
- message: plain-text message
- password: password string

Response:

```json
{
  "success": true,
  "stegoImage": "data:image/png;base64,...",
  "metadata": {
    "width": 1200,
    "height": 800,
    "format": "png",
    "size": 12345,
    "outputFormat": "png"
  }
}
```

### POST /api/decode

Multipart form-data:

- image: stego image
- password: password string

Response:

```json
{
  "success": true,
  "message": "Original secret message"
}
```

## Project architecture

- `backend/services/encryptionService.js`: AES key derivation and encryption/decryption
- `backend/services/steganographyService.js`: LSB steganography
- `backend/controllers/steganographyController.js`: API orchestration
- `backend/routes/steganographyRoutes.js`: API routes
- `frontend/src/App.jsx`: main UI layout
- `frontend/src/components/*`: reusable UI components

## Security considerations

- Passwords are never stored.
- Messages are processed in memory only.
- Uploaded files are validated by type and size.
- Temporary files are not persisted.
- No secret content is logged.

## Known limitations

- The app assumes the original Java implementation uses AES-128-ECB as the default `Cipher.getInstance("AES")` behavior, which is equivalent to `aes-128-ecb` in Node.js/OpenSSL.
- Because LSB embedding alters the image data slightly, the stego image should be saved as PNG to avoid lossy compression artifacts.
- Very small images may not fit a large message.

## Conversion from the Java Swing app to web architecture

The original Java application used a desktop flow:

1. Select image
2. Enter message and password
3. Encrypt using AES with SHA-1(password) key material
4. Base64 encode encrypted bytes
5. Append `#END#`
6. Modify the blue channel LSB in each pixel
7. Save as PNG

The web portfolio preserves this same algorithm in a Node.js backend and drives it through a React frontend. The UI mirrors the original encode/decode workflow while adding modern interactions such as drag-and-drop upload, preview, toast messages, and responsive layout.
