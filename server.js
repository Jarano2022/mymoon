const http = require('http');
const express = require('express');
const fs = require('fs');
const app = express();

const port = 3000;
const host = '192.168.1.52';

app.use(express.static('wwwroot'));

app.get('/es-es', (req, res) => {
    res.sendFile(__dirname + 'wwwroot/index.html');
});



app.listen(port, host, () => {console.log(`el servidor esta corriendo en http://${host}:${port}/`);});