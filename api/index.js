const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const serverless = require('serverless-http');

const app = express();

// Forward all requests to Shell Shockers
app.use('/', createProxyMiddleware({
  target: 'https://shellshock.io',
  changeOrigin: true,
  followRedirects: true
}));

module.exports.handler = serverless(app);
