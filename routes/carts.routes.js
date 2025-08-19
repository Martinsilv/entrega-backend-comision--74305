import { Router } from "express";
import CartManager from "../managers/CartManager.js";

const router = Router();
const cartManager = new CartManager();


router.post("/", async (req, res) => {
  try {
    const cart = await cartManager.createCart();
    res.status(201).json(cart);
  } catch (error) {
    console.error("Error al crear carrito:", error);
    res.status(500).json({ error: "Error interno al crear carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al obtener carrito:", error);
    res.status(500).json({ error: "Error interno al obtener carrito" });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.addProductToCart(cid, pid, 1);
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({ error: "Error interno al agregar producto al carrito" });
  }
});


router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const cart = await cartManager.removeProduct(cid, pid);
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({ error: "Error interno al eliminar producto del carrito" });
  }
});


router.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products } = req.body;
  try {
    const cart = await cartManager.updateCartProducts(cid, products || []);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({ error: "Error interno al actualizar carrito" });
  }
});


router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  if (quantity === undefined || isNaN(quantity)) {
    return res.status(400).json({ error: "Cantidad inválida" });
  }

  try {
    const cart = await cartManager.updateProductQuantity(cid, pid, Number(quantity));
    if (!cart) return res.status(404).json({ error: "Carrito o producto no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al actualizar cantidad del producto:", error);
    res.status(500).json({ error: "Error interno al actualizar cantidad del producto" });
  }
});


router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cart = await cartManager.clearCart(cid);
    if (!cart) return res.status(404).json({ error: "Carrito no encontrado" });
    res.json(cart);
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({ error: "Error interno al vaciar carrito" });
  }
});

export default router;
