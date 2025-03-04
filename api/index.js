import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import serverless from 'serverless-http';

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://shellshock.io',
  changeOrigin: true,
  selfHandleResponse: true, // we'll handle the response manually
  onProxyRes: (proxyRes, req, res) => {
    const body = [];
    proxyRes.on('data', chunk => {
      body.push(chunk);
    });
    proxyRes.on('end', () => {
      const buffer = Buffer.concat(body);
      res.removeHeader('transfer-encoding');
      res.setHeader('Content-Length', buffer.length);
      res.end(buffer);
    });
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
}));

export default serverless(app);
