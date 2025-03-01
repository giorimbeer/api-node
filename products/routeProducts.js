import { ProductController } from "./productController.js";
import { Router } from "express";

export const productRouter = Router(); // Crea una instancia del router

// Define las rutas para las operaciones de productos

// Obtiene todos los productos con opción de filtrar por categoría (usando query params)
productRouter.get("/", ProductController.getProducts);

// Obtiene las categorías de productos
productRouter.get("/categories", ProductController.getCategories);

// Busca un producto por nombre (usando query params)
productRouter.get("/search", ProductController.getProductByName);

// Obtiene un producto por su ID (usando params)
productRouter.get("/:id", ProductController.getProductById);

// Agrega un nuevo producto
productRouter.post("/", ProductController.addProduct);

// Actualiza un producto por su ID
productRouter.patch("/:id", ProductController.updateProductById);

// Actualiza un producto por su nombre
productRouter.patch("/update/:name", ProductController.updateProductByName);

// Elimina un producto por su ID
productRouter.delete("/:id", ProductController.deleteProductById);

// Elimina un producto por su nombre
productRouter.delete("/delete/:name", ProductController.deleteProductByName);
