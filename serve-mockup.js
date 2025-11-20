const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8765;
const FILE = 'dashboard-mockup.html';

const server = http.createServer((req, res) => {
  console.log(`Request: ${req.url}`);
  
  if (req.url === '/' || req.url === '/dashboard-mockup.html') {
    fs.readFile(FILE, (err, data) => {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('File not found');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
