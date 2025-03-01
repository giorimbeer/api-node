import { ProductModel } from "./productModelMySQL.js";
import { partialValidationProduct, validateProduct } from "./produtcScheme.js";

/**
 * Controlador para gestionar las operaciones de productos.
 */
export class ProductController {
  // Retorna las categorías de productos
  static getCategories(req, res) {
    ProductModel.getCategories().then((categories) => {
      res.json(categories);
    });
  }

  // Obtiene todos los productos, filtrando por categoría si se proporciona en la consulta.
  static getProducts(req, res) {
    const { category } = req.query;
    ProductModel.getProducts({ category: category }).then((products) => {
      res.json(products);
    });
  }

  // Busca un producto por su ID
  static getProductById(req, res) {
    const { id } = req.params;
    ProductModel.getProductById({ id }).then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    });
  }

  // Busca un producto por su nombre
  static getProductByName(req, res) {
    const { name } = req.query;
    ProductModel.getProductByName({ name }).then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    });
  }

  // Agrega un nuevo producto
  static addProduct(req, res) {
    const { body } = req;
    const productError = validateProduct(body).error;

    // Si hay error de validación, se retorna un error 400.
    if (productError) {
      console.log(productError);
      return res.status(400).json({ message: productError.message });
    }

    // Se intenta agregar el producto y se maneja el resultado.
    ProductModel.addProduct({ product: body })
      .then((product) => {
        if (product.error) {
          return res.status(400).json({ message: product.error });
        }
        return res
          .status(201)
          .json({ message: "Product added", product: product });
      })
      .catch((e) => {
        return res.status(400).json({ message: e });
      });
  }

  // Actualiza un producto por su ID
  static updateProductById(req, res) {
    const { id } = req.params;
    const { body } = req;
    const updateError = partialValidationProduct(body).error;

    // Si la validación falla, se retorna un error 400.
    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    // Se actualiza el producto y se retorna el resultado.
    ProductModel.updateProductById({ id, product: body }).then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      if (product.message) {
        return res
          .status(400)
          .json({ message: "ocurrio un error", error: product.message });
      }
      res.json({ message: "Product updated", product: product });
    });
  }

  // Actualiza un producto por su nombre
  static updateProductByName(req, res) {
    const { name } = req.params;
    const { body } = req;
    const updateError = partialValidationProduct(body).error;

    // Si la validación falla, se retorna un error 400.
    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    // Se actualiza el producto y se retorna el resultado.
    ProductModel.updateProductByName({ name, product: body }).then(
      (product) => {
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        if (product.message) {
          return res
            .status(400)
            .json({ message: "ocurrio un error", error: product.message });
        }
        res.json({ message: "Product updated", product: product });
      }
    );
  }

  // Elimina un producto usando su ID
  static deleteProductById(req, res) {
    const { id } = req.params;
    ProductModel.deleteProductById({ id: id.toString() }).then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted" });
    });
  }

  // Elimina un producto usando su nombre
  static deleteProductByName(req, res) {
    const { name } = req.params;
    ProductModel.deleteProductByName({ name: name.toString() }).then(
      (product) => {
        if (!product) {
          return res.status(404).json({ message: "Product not found" });
        }
        res.json({ message: "Product deleted" });
      }
    );
  }
}
