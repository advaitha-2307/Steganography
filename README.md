# Image Steganography Tool with AES Security

This project provides two separate web applications backed by a shared Node.js API while preserving the core steganography algorithm:

- **Encrypt Website (`encrypt-site/`, port `5173`)**: For the sender who hides a password-protected secret message inside a cover image and downloads the lossless PNG stego image.
- **Decrypt Website (`decrypt-site/`, port `5174`)**: For the recipient who uploads the received stego PNG image and enters the password to extract the hidden message.
- **Backend API (`backend/`, port `5001`)**: Performs AES encryption/decryption and blue-channel LSB steganography in memory.

### Core algorithm
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
cd ../encrypt-site
npm install
cd ../decrypt-site
npm install
```

## How to run

Open three terminals:

Terminal 1 (Backend API):
```bash
cd backend
npm start
```

Terminal 2 (Encrypt Website — Sender):
```bash
cd encrypt-site
npm run dev
```

Terminal 3 (Decrypt Website — Recipient):
```bash
cd decrypt-site
npm run dev
```

Then open:
- **Encrypt Website (Sender):** `http://localhost:5173`
- **Decrypt Website (Recipient):** `http://localhost:5174`

## How to use

### Sender (Encrypt Website — `http://localhost:5173`)
1. Upload or drag-and-drop a cover image.
2. Enter a secret message.
3. Enter a password.
4. Click **Encrypt & Hide Message**.
5. Download the generated PNG stego image (`stego-image.png`) and share it with the recipient along with the password.

### Recipient (Decrypt Website — `http://localhost:5174`)
1. Upload or drag-and-drop the received stego PNG image.
2. Enter the password shared by the sender.
3. Click **Extract & Decrypt Message**.
4. Read or copy the original hidden message.

## API documentation

### POST /api/encode

Multipart form-data:
- `image`: image file
- `message`: plain-text message
- `password`: password string

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
- `image`: stego image
- `password`: password string

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
- `encrypt-site/`: Standalone React + Vite website for encrypting messages into images
- `decrypt-site/`: Standalone React + Vite website for decrypting hidden messages from images

## Security considerations

- Passwords are never stored.
- Messages are processed in memory only.
- Uploaded files are validated by type and size.
- Temporary files are not persisted.
- No secret content is logged.
