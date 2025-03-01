import mysql from "mysql2/promise";

// Crea la conexión a la base de datos con la configuración especificada
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ingenio-hogar",
});

// Función para darle formato a los datos de un usuario
function userFormat(user) {
  if (!user) return null; // Retorna null si no se encontró ningún usuario

  return {
    id: user.id_usuario,
    name: user.nombre,
    email: user.correo,
    phone: user.telefono,
    address: user.direccion,
    password: user.contraseña,
  };
}

// Clase que define los métodos para interactuar con la tabla "Usuarios" en la BD
export class UserModel {
  // Obtiene todos los usuarios y los retorna
  static async getUsers() {
    return connection
      .query("SELECT * FROM `Usuarios`")
      .then((results) => {
        return results[0].map((user) => userFormat(user));
      })
      .catch((e) => {
        console.log("Ocurrió un error al buscar los usuarios: ", e);
      });
  }

  // Obtiene un usuario por su ID
  static async getUserById({ id }) {
    return connection
      .query("SELECT * FROM `Usuarios` WHERE id_usuario = ?", [id])
      .then((results) => {
        // results[0][0] es el primer (y único) usuario encontrado
        return userFormat(results[0][0]);
      })
      .catch((e) => {
        console.log("Ocurrió un error al buscar usuario por ID: ", e);
      });
  }

  // Obtiene un usuario por su correo electrónico
  static async getUserByEmail({ email }) {
    return connection
      .query("SELECT * FROM `Usuarios` WHERE correo = ?", [email])
      .then((results) => {
        return userFormat(results[0][0]);
      })
      .catch((e) => {
        console.log("Ocurrió un error al buscar usuario por correo: ", e);
      });
  }

  // Realiza el login de un usuario verificando correo y contraseña
  static async login({ user }) {
    return connection
      .query("SELECT * FROM usuarios WHERE correo = ? AND contraseña = ?", [
        user.email,
        user.password,
      ])
      .then((res) => {
        // Retorna el usuario encontrado, formateado
        return userFormat(res[0][0]);
      })
      .catch((e) => e);
  }

  // Agrega un nuevo usuario a la BD y retorna el usuario agregado
  static async addUser({ user }) {
    return connection
      .query(
        "INSERT INTO `Usuarios` (nombre, correo, contraseña, telefono, direccion) VALUES (?, ?, ?, ?, ?)",
        [user.name, user.email, user.password, user.phone, user.address]
      )
      .then(() => {
        // Busca y retorna el usuario recién insertado, usando su correo
        return this.getUserByEmail({ email: user.email });
      })
      .catch((e) => e);
  }

  // Actualiza la información de un usuario existente
  static async updateUser({ id, user }) {
    return this.getUserById({ id })
      .then(async (oldUser) => {
        if (!oldUser) {
          return null; // Retorna null si no se encuentra el usuario a actualizar
        }
        // Combina los datos actuales del usuario con los nuevos datos proporcionados
        let newUser = { ...oldUser, ...user };
        return newUser;
      })
      .then((newUser) => {
        // Ejecuta la consulta de actualización en la BD
        return connection.query(
          "UPDATE `Usuarios` SET nombre = ?, correo = ?, contraseña = ?, telefono = ?, direccion = ? WHERE id_usuario = ?",
          [
            newUser.name,
            newUser.email,
            newUser.password,
            newUser.phone,
            newUser.address,
            id,
          ]
        );
      })
      .then(() => {
        // Retorna el usuario actualizado
        return this.getUserById({ id });
      })
      .catch((e) => e);
  }

  // Elimina un usuario de la BD por su ID
  static async deleteUser({ id }) {
    return this.getUserById({ id }).then((user) => {
      if (!user) return null; // Retorna null si el usuario no existe

      // Ejecuta la consulta de eliminación
      connection.query("DELETE FROM `Usuarios` WHERE id_usuario = ?", [id]);
      return "Usuario eliminado";
    });
  }
}
