import { partialValidationUser, validateUser } from "./userScheme.js";
import { UserModel } from "./userModelMySQL.js";

export class UserController {
  // Retorna todos los usuarios en formato JSON
  static getUsers(req, res) {
    UserModel.getUsers().then((users) => {
      res.json(users);
    });
  }

  // Busca un usuario por su ID y lo retorna
  static getUserById(req, res) {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL

    UserModel.getUserById({ id }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });
  }

  // Busca un usuario por su email y lo retorna
  static getUserByEmail(req, res) {
    const { email } = req.query; // Extrae el email de los parámetros de consulta

    UserModel.getUserByEmail({ email }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });
  }

  // Realiza el login de un usuario
  static login(req, res) {
    const { body } = req; // Obtiene los datos enviados en el cuerpo de la petición

    UserModel.login({ user: body }).then((user) => {
      // Valida parcialmente el cuerpo de la petición
      if (partialValidationUser(body).error) {
        return res
          .status(400)
          .json({ message: partialValidationUser(body).error.issues });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    });
  }

  // Agrega un nuevo usuario a la BD
  static addUser(req, res) {
    const { body } = req; // Obtiene los datos del usuario desde el cuerpo de la petición

    // Valida el usuario con validación completa
    if (validateUser(body).error) {
      return res.status(400).json({ message: validateUser(body).error.issues });
    }

    // Intenta agregar el usuario y retorna el resultado
    UserModel.addUser({ user: body }).then((user) => {
      if (user.message) {
        return res
          .status(400)
          .json({ message: "ocurrio un error", error: user.message });
      }
      return res.status(201).json({ message: "usuario creado", user: user });
    });
  }

  // Actualiza la información de un usuario existente
  static updateUser(req, res) {
    const { id } = req.params; // Extrae el ID del usuario desde los parámetros de la URL
    const { body } = req; // Obtiene los nuevos datos del usuario desde el cuerpo de la petición

    // Valida parcialmente la información a actualizar
    if (partialValidationUser(body).error) {
      return res
        .status(400)
        .json({ message: partialValidationUser(body).error.issues });
    }

    // Intenta actualizar el usuario en la BD
    UserModel.updateUser({ id: id, user: body }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      if (user.message) {
        return res
          .status(400)
          .json({ message: "ocurrio un error", error: user.message });
      }
      res.json({ message: "usuario actualizado", user: user });
    });
  }

  // Elimina un usuario por su ID
  static deleteUser(req, res) {
    const { id } = req.params; // Extrae el ID de los parámetros de la URL

    UserModel.deleteUser({ id: id.toString() }).then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ message: "User deleted" });
    });
  }
}
