import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import busArrivalHandler from './api/bus-arrival.js';
import healthHandler from './api/health.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // API Routes matching Vercel serverless paths
  app.all(['/api/bus-arrival', '/api/busArrival'], async (req, res) => {
    try {
      await busArrivalHandler(req, res);
    } catch (err) {
      console.error('API Error in /api/bus-arrival:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.all('/api/health', async (req, res) => {
    try {
      await healthHandler(req, res);
    } catch (err) {
      console.error('API Error in /api/health:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  if (!isProd) {
    // Vite dev server middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
