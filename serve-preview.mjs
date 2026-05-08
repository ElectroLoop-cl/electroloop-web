import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

createServer((req, res) => {
  let url = req.url.split('?')[0];

  // Try exact file first
  let filePath = join(DIST, url);

  // If directory, look for index.html
  if (!existsSync(filePath) || (existsSync(filePath) && !extname(filePath))) {
    const withIndex = join(DIST, url, 'index.html');
    if (existsSync(withIndex)) {
      filePath = withIndex;
    } else if (!existsSync(filePath)) {
      // 404
      filePath = join(DIST, '404.html');
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
    }
  }

  const ext = extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  try {
    const content = readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  } catch (e) {
    res.writeHead(500);
    res.end('Error: ' + e.message);
  }
}).listen(3000, () => console.log('Serving dist on http://localhost:3000'));
