import express from 'express';
import { __dirname } from './utils.js';
import { engine } from 'express-handlebars';
import path from 'path';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { Server } from 'socket.io';
import ProductManager from './managers/ProductManager.js';

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const productManager = new ProductManager(path.join(__dirname, 'data/products.json'));

app.get('/home', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('home', { title: 'Home', products });
});

app.get('/realtimeproducts', async (req, res) => {
  const products = await productManager.getProducts();
  res.render('realTimeProducts', { title: 'Productos en tiempo real', products });
});

const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const io = new Server(httpServer);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  socket.emit('products', await productManager.getProducts());

  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });

  socket.on('deleteProduct', async (productId) => {
    await productManager.deleteProduct(productId);
    const updatedProducts = await productManager.getProducts();
    io.emit('products', updatedProducts);
  });
});
