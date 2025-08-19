import express from 'express';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import path from 'path';
import mongoose from 'mongoose';
import { Server } from 'socket.io';

import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;
const MONGO_URI = 'mongodb://127.0.0.1:27017/baseDeDatos';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.log('Error al conectar a MongoDB:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine({
  helpers: {
    multiply: (a, b) => a * b,
    total: (products) => products.reduce((sum, p) => sum + p.product.price * p.quantity, 0)
  }
}));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productManager = new ProductManager();

app.get('/home', async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100, page: 1 });

   

   res.render('home', { 
  title: 'Lista de Productos', 
  products: result.docs.map(p => ({
    title: p.title,
    price: p.price,
    stock: p.stock,
    category: p.category
  }))
});
  } catch (error) {
    console.error("❌ Error en /home:", error);
    res.status(500).send(`Error al obtener productos: ${error.message}`);
  }
});

app.get('/realtimeproducts', async (req, res) => {
  try {
    const result = await productManager.getProducts({ limit: 100, page: 1 });
    res.render('realTimeProducts', { title: 'Productos en tiempo real', products: result.docs });
  } catch (error) {
    res.status(500).send(`Error al obtener productos: ${error.message}`);
  }
});

const httpServer = app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  socket.emit('products', (await productManager.getProducts({ limit: 100, page: 1 })).docs);

  socket.on('addProduct', async (data) => {
    await productManager.addProduct(data);
    io.emit('products', (await productManager.getProducts({ limit: 100, page: 1 })).docs);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    io.emit('products', (await productManager.getProducts({ limit: 100, page: 1 })).docs);
  });
});
