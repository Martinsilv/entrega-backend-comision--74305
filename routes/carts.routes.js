import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const router = Router();
const cartManager = new CartManager('./data/carts.json');

// Crear un nuevo carrito
router.post('/', async (req, res) => {
  const newCart = await cartManager.createCart();
  res.status(201).json(newCart);
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
  const cart = await cartManager.getCartById(parseInt(req.params.cid));
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  const updatedCart = await cartManager.addProductToCart(
    parseInt(req.params.cid),
    parseInt(req.params.pid)
  );
  if (updatedCart) {
    res.json(updatedCart);
  } else {
    res.status(404).json({ error: 'Error al agregar el producto al carrito' });
  }
});

export default router;
