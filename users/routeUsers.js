import { UserController } from "./userController.js";
import { Router } from "express";

// Crea una instancia del router para definir rutas relacionadas con usuarios
export const userRouter = Router();

// Retorna una lista de todos los usuarios
userRouter.get("/", UserController.getUsers);

// Busca un usuario por su correo electrónico (usando query params)
userRouter.get("/search", UserController.getUserByEmail);

// Retorna un usuario específico basado en su ID (usando params)
userRouter.get("/:id", UserController.getUserById);

// Crea un nuevo usuario
userRouter.post("/", UserController.addUser);

// Maneja la autenticación del usuario (inicio de sesión)
userRouter.post("/login", UserController.login);

// Actualiza la información de un usuario basado en su ID
userRouter.patch("/:id", UserController.updateUser);

// Elimina un usuario basado en su ID
userRouter.delete("/:id", UserController.deleteUser);
