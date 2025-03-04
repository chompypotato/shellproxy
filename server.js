const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy all requests to Shell Shockers
app.use('/', createProxyMiddleware({
  target: 'https://shellshock.io',
  changeOrigin: true,
  followRedirects: true
}));

// Use Vercel's assigned port or default to 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
