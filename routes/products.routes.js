import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager("products.json");

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error interno al obtener los productos" });
  }
});

// Obtener producto p
router.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    if (isNaN(pid)) {
      return res.status(400).json({ error: "El ID debe ser un número" });
    }

    const product = await productManager.getProductById(parseInt(pid));
    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error interno al obtener el producto" });
  }
});

// Agregar producto
router.post("/", async (req, res) => {
  try {
    const { title, price, stock } = req.body;

    if (!title || !price || !stock) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    const newProduct = await productManager.addProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error interno al agregar producto" });
  }
});

export default router;
