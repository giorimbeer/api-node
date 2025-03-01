import mysql from "mysql2/promise";

// Crea la conexión a la base de datos
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ingenio-hogar",
});

/**
 * Formatea un objeto producto obtenido de la BD al formato esperado.
 * Convierte la imagen a base64 para ser enviada en la respuesta.
 */
function productFormat(product) {
  if (!product) return null;

  return {
    id: product.id,
    name: product.nombre,
    price: product.precio,
    category: product.categoria,
    description: product.descripcion,
    image: product.imagen.toString("base64"),
  };
}

// Clase que contiene los métodos para interactuar con la tabla "producto"
export class ProductModel {
  /**
   * Obtiene todas las categorías distintas de productos.
   */
  static async getCategories() {
    return connection
      .query("SELECT DISTINCT categoria FROM producto;")
      .then((results) => {
        const categories = results[0];
        return categories;
      })
      .catch((e) => {
        console.log("ocurrio un error al buscar las categorias: ", e);
      });
  }

  /**
   * Obtiene todos los productos, con opción de filtrar por categoría.
   */
  static async getProducts({ category }) {
    return connection
      .query("SELECT * FROM `producto`")
      .then((results) => {
        // Filtra los productos por categoría si se especifica
        if (category) {
          const filteredProducts = results[0].filter(
            (product) =>
              product.categoria.toLowerCase() === category.toLowerCase()
          );
          return filteredProducts.map((product) => productFormat(product));
        }
        // Devuelve todos los productos formateados
        return results[0].map((product) => productFormat(product));
      })
      .catch((e) => {
        console.log("ocurrio un error al buscar los productos: ", e);
      });
  }

  /**
   * Busca un producto por su ID.
   */
  static async getProductById({ id }) {
    return connection
      .query("SELECT * FROM `producto` WHERE id = ?", [id])
      .then((results) => {
        return productFormat(results[0][0]);
      })
      .catch((e) => {
        console.log("ocurrio un error al buscar producto por id: ", e);
      });
  }

  /**
   * Busca un producto por su nombre.
   */
  static async getProductByName({ name }) {
    return connection
      .query("SELECT * FROM `producto` WHERE nombre = ?", [name])
      .then((results) => {
        return productFormat(results[0][0]);
      })
      .catch((e) => {
        console.log("ocurrio un error al buscar el producto por nombre: ", e);
      });
  }

  /**
   * Agrega un nuevo producto a la base de datos.
   */
  static async addProduct({ product }) {
    return connection
      .query(
        "INSERT INTO `producto` (nombre, descripcion, imagen, precio, categoria) VALUES (?, ?, ?, ?, ?)",
        [
          product.name.toLowerCase(),
          product.description.toLowerCase(),
          Buffer.from(product.image, "base64"),
          product.price,
          product.category.toLowerCase(),
        ]
      )
      .then(() => {
        return this.getProductByName({ name: product.name });
      })
      .catch((e) => {
        if (e.code === "ER_DUP_ENTRY") {
          return { error: "ya existe un producto con ese nombre o imagen." };
        } else {
          console.log("ocurrio un error al crear el product: " + e);
          return { error: e.code };
        }
      });
  }

  /**
   * Actualiza un producto basado en su ID.
   */
  static async updateProductById({ id, product }) {
    return this.getProductById({ id })
      .then(async (oldProduct) => {
        if (!oldProduct) return null;
        // Fusiona datos antiguos y nuevos
        let newProduct = { ...oldProduct, ...product };
        return newProduct;
      })
      .then((newProduct) => {
        return connection.query(
          "UPDATE producto SET nombre = ?, descripcion = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?",
          [
            newProduct.name.toLowerCase(),
            newProduct.description.toLowerCase(),
            Buffer.from(newProduct.image, "base64"),
            newProduct.price,
            newProduct.category.toLowerCase(),
            newProduct.id,
          ]
        );
      })
      .then(() => {
        return this.getProductById({ id });
      })
      .catch((e) => e);
  }

  /**
   * Actualiza un producto basado en su nombre.
   */
  static async updateProductByName({ name, product }) {
    return this.getProductByName({ name })
      .then((oldProduct) => {
        if (!oldProduct) return null;
        // Fusiona datos antiguos y nuevos
        let newProduct = { ...oldProduct, ...product };
        return newProduct;
      })
      .then((newProduct) => {
        return connection
          .query(
            "UPDATE producto SET nombre = ?, descripcion = ?, imagen = ?, precio = ?, categoria = ? WHERE id = ?",
            [
              newProduct.name.toLowerCase(),
              newProduct.description.toLowerCase(),
              Buffer.from(newProduct.image, "base64"),
              newProduct.price,
              newProduct.category.toLowerCase(),
              newProduct.id,
            ]
          )
          .then(() => newProduct.id);
      })
      .then((res) => {
        return this.getProductById({ id: res });
      })
      .catch((e) => e);
  }

  /**
   * Elimina un producto de la BD basado en su ID.
   */
  static async deleteProductById({ id }) {
    return this.getProductById({ id }).then((product) => {
      if (!product) return null;
      // Ejecuta la eliminación del producto
      connection.query("DELETE producto From `producto` WHERE id = ?", [id]);
      return "eliminado";
    });
  }

  /**
   * Elimina un producto de la BD basado en su nombre.
   */
  static async deleteProductByName({ name }) {
    return this.getProductByName({ name }).then((product) => {
      if (!product) return null;
      // Ejecuta la eliminación del producto
      connection.query("DELETE producto From `producto` WHERE nombre = ?", [
        name,
      ]);
      return "eliminado";
    });
  }
}
