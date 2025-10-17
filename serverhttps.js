const https = require("https");
const fs = require("fs");
const path = require("path");
const express = require("express");

const options = {
  key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")), // Path to your private key file
  cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")), // Path to your certificate file
};

const PORT = process.env.HTTPS_PORT || 3443;

const app = express();

function encenderServidor() {

  // Servir archivos estáticos desde wwwroot
  app.use(express.static(path.join(__dirname, "wwwroot")));

  // Manejo de 404 para rutas no resueltas por static
  app.use((req, res) => {
    res
      .status(404)
      .type("text/plain")
      .send("Ruta no encontrada o archivo no encontrado.");
    console.error(`Error 404: Archivo no encontrado - ${req.originalUrl}`);
  });

  // Middleware de manejo de errores
  app.use((err, req, res, next) => {
    console.error(`Error interno al procesar ${req.originalUrl}:`, err);
    res.status(500).type("text/plain").send("Error interno del servidor.");
  });

  // Crear servidor HTTPS con la app de Express
  https.createServer(options, app).listen(PORT, () => {
    console.log(`el servidor esta corriendo en https://localhost:${PORT}`);
  });
}

encenderServidor();