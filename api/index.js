import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import serverless from 'serverless-http';

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://shellshock.io',
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
}));

// Export the wrapped Express app as the default export.
export default serverless(app);
