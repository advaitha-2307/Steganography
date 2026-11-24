const fs = require('fs');

(async () => {
  const img = await fetch('http://localhost:5001/health').then(res => res.json());
  console.log('health', img);

  const canvas = require('sharp')({
    create: {
      width: 128,
      height: 128,
      channels: 4,
      background: { r: 10, g: 20, b: 30, alpha: 255 }
    }
  }).png().toBuffer();

  const png = await canvas;
  const form1 = new FormData();
  form1.append('image', new Blob([png], { type: 'image/png' }), 'input.png');
  form1.append('message', 'hello world');
  form1.append('password', 'secret-pass');

  const encodeRes = await fetch('http://localhost:5001/api/encode', { method: 'POST', body: form1 });
  const encodeJson = await encodeRes.json();
  console.log('encodeStatus', encodeRes.status, encodeJson.success);

  const dataUrl = encodeJson.stegoImage;
  const base64 = dataUrl.split(',')[1];
  const stego = Buffer.from(base64, 'base64');

  const form2 = new FormData();
  form2.append('image', new Blob([stego], { type: 'image/png' }), 'stego.png');
  form2.append('password', 'secret-pass');

  const decodeRes = await fetch('http://localhost:5001/api/decode', { method: 'POST', body: form2 });
  const decodeJson = await decodeRes.json();
  console.log('decodeStatus', decodeRes.status, decodeJson.success, decodeJson.message);
})();
