const express = require('express');
const path = require('path');
const socket = require('socket.io');
const http = require('http');
const morgan = require('morgan');

// Inicialización
const app = express();
const ipAddress = '192.168.1.81';
const port = process.env.PORT || 3000;

// Configuración del motor de plantillas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

// Creación del servidor HTTP
const server = http.createServer(app);
const io = socket.listen(server);
require('./socket').connection(io);

// Configuración del servidor y escucha
server.listen(port, ipAddress, () => {
  console.log(`Servidor en ejecución en http://${ipAddress}:${port}`);
});

// Middleware
app.use(morgan('dev'));

// Rutas
app.get('/', (req, res, next) => {
  res.render('index');
});

// Configuración de archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Inicio del servidor
server.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
