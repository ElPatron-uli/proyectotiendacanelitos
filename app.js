require('dotenv').config(); // ✅ carga las variables de entorno desde .env

const path = require('path');
const express = require('express');
const session = require('express-session');
const morgan = require('morgan');

// Importar rutas
const rutasComunes = require('./rutas/comunes');
const rutasTienda = require('./rutas/tienda');
const rutasAuth = require('./rutas/auth');
const rutasAdmin = require('./rutas/admin');
const rutasVendedor = require('./rutas/vendedor');
const rutasCarrito = require('./rutas/carrito');

const app = express();
const PORT = process.env.PORT || 3000;

// Motor de plantillas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'vistas'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'canelitos_super_secreto',
  resave: false,
  saveUninitialized: false
}));

// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'publico')));

// Inyecta variables globales en las vistas
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  res.locals.rol = req.session.rol || 'invitado';
  res.locals.carrito = req.session.carrito || [];
  next();
});

// Rutas principales
app.use('/', rutasComunes);
app.use('/', rutasTienda);
app.use('/', rutasCarrito);
app.use('/auth', rutasAuth);
app.use('/admin', rutasAdmin);
app.use('/vendedor', rutasVendedor);

// Página 404
app.use((req, res) => {
  res.status(404).render('tienda/404', { titulo: 'Página no encontrada' });
});

// Arrancar servidor
app.listen(PORT, () => {
  console.log(`✅ Tienda Canelitos corriendo en http://localhost:${PORT}`);
});
