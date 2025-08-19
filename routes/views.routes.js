import { Router } from "express";
import ProductManager from "../managers/ProductManager.js";

const router = Router();
const productManager = new ProductManager();


router.get("/home", async (req, res) => {
  try {
    const { limit, page, sort, category, status } = req.query;

    const query = {};
    if (category) query.category = category;
    if (status !== undefined) query.status = status;

    const result = await productManager.getProducts({ limit, page, query, sort });
 
    res.render("home", {
      title: "Lista de Productos",
      products: result.docs.map(p => ({
        title: p.title,
        price: p.price
      }))
    });

  } catch (error) {
    console.error("❌ Error en /home:", error.message);
    res.status(500).send("Error cargando productos");
  }
});

export default router;
