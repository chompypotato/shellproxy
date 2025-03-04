import express from 'express';
import serverless from 'serverless-http';
import fetch from 'node-fetch';

const app = express();

app.get('*', async (req, res) => {
  try {
    // Construct the target URL based on the incoming request URL.
    const targetUrl = 'https://shellshock.io' + req.originalUrl;
    
    // Fetch the target URL and wait for the complete response.
    const response = await fetch(targetUrl);
    const bodyBuffer = await response.buffer();

    // Copy over headers except transfer-encoding.
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    });
    // Ensure a fixed Content-Length header.
    res.setHeader('Content-Length', bodyBuffer.length);

    // Set the response status code and send the buffered response.
    res.status(response.status).send(bodyBuffer);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: ' + err.message);
  }
});

export default serverless(app);
