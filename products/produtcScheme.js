import z from "zod";

// un esquema para validar los productos
const Product = z.object({
  name: z.string().min(3),
  price: z.number().int().positive(),
  description: z.string().min(10),
  image: z.string(),
  category: z.string(),
});

// validacion extricta del esquema (todos los campos son obligatorios)
export function validateProduct(object) {
  return Product.safeParse(object);
}

// validacion parcial del esquema (todos los campos son opcionales)
export function partialValidationProduct(object) {
  return Product.partial().safeParse(object);
}
