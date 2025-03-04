const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const serverless = require('serverless-http');

const app = express();

app.use('/', createProxyMiddleware({
  target: 'https://shellshock.io',
  changeOrigin: true,
  selfHandleResponse: true, // We'll manually handle the response
  onProxyRes: (proxyRes, req, res) => {
    let body = [];
    proxyRes.on('data', chunk => {
      body.push(chunk);
    });
    proxyRes.on('end', () => {
      const buffer = Buffer.concat(body);
      // Remove the transfer-encoding header if set
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

// Export the wrapped app as the default export for serverless-http.
module.exports = { default: serverless(app) };
