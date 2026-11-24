import express from 'express';
import cors from 'cors';
import steganographyRoutes from './routes/steganographyRoutes.js';

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', steganographyRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'steganography-backend' });
});

app.use((error, _req, res, _next) => {
  const message = error && error.message ? error.message : 'Failed to process image';
  res.status(400).json({ success: false, error: message });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
