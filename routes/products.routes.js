import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const router = Router();
const productManager = new ProductManager('./data/products.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
  const products = await productManager.getProducts();
  res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Agregar un producto
router.post('/', async (req, res) => {
  const newProduct = await productManager.addProduct(req.body);
  res.status(201).json(newProduct);
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
  if (updatedProduct) {
    res.json(updatedProduct);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  const result = await productManager.deleteProduct(parseInt(req.params.pid));
  if (result) {
    res.json({ message: 'Producto eliminado' });
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

export default router;
