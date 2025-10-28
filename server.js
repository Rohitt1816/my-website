const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? './index.html' : `.${req.url}`;
  console.log(`Request for: ${filePath}`); // 👈 This line helps debug

  const extname = path.extname(filePath);
  let contentType = 'text/html';

  const mimeTypes = {
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
  };

  if (mimeTypes[extname]) contentType = mimeTypes[extname];

  fs.readFile(filePath, (error, content) => {
    if (error) {
      console.error('❌ Error:', error.code, filePath);
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Not Found</h1>');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`🚀 Server running at http://${hostname}:${port}/`);
});
