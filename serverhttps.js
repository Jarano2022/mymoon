const https = require('https');
const fs = require('fs');
const path = require('path');

const options = {
  key: fs.readFileSync('./certs/key.pem'), // Path to your private key file
  cert: fs.readFileSync('./certs/cert.pem')  // Path to your certificate file
};

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.ico': 'image/x-icon'
};

const PORT = process.env.HTTPS_PORT || 3443;

https.createServer(options, (req, res) => {
  const url = req.url === '/' ? '/index.html' : req.url;
  const filePath = path.join(__dirname, 'wwwroot', url);
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  fs.stat(filePath, (statError, stats) => {
    if (statError) {
      if (statError.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada o archivo no encontrado.');
        console.error(`Error 404: Archivo no encontrado - ${filePath}`);
      } else {
        console.error(`Este es el error al acceder a ${filePath}: ${statError}.`);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Error interno del servidor.');
      }
    } else if (stats.isDirectory()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('No se puede acceder a directorios directamente.');
      console.error(`Error 404: Intento de acceso a directorio - ${filePath}`);
    } else {
      fs.readFile(filePath, (error, data) => {
        if (error) {
          console.error(`Este es el error al leer ${filePath}: ${error}.`);
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('Error interno del servidor.');
        } else {
          res.writeHead(200, { 'Content-Type': contentType });
          res.end(data);
        }
      });
    }
  });
}).listen(PORT, () => {
  console.log(`el servidor esta corriendo en https://localhost:${PORT}`);
});