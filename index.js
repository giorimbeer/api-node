import express from "express";
import cors from "cors";

import { productRouter } from "./products/routeProducts.js";
import { userRouter } from "./users/routeUsers.js";

const app = express();

const PORT = 3000;

app.use(cors()); // Habilita CORS para todos los dominios

app.use(express.json({ limit: "10mb" })); // Aumenta el límite para JSON
app.use(express.urlencoded({ limit: "10mb", extended: true })); // Para datos de formularios

// Rutas de la API REST de productos
app.use("/products", productRouter);

// Rutas de la API REST de usuarios
app.use("/users", userRouter);

// inicio del servidor
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
