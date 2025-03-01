import z from "zod";

// un esquema para validar los usuarios
const User = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10).max(10),
  address: z.string(),
  password: z.string().min(6),
});

// validacion extricta del esquema (todos los campos son obligatorios)
export function validateUser(object) {
  return User.safeParse(object);
}

// validacion parcial del esquema (todos los campos son opcionales)
export function partialValidationUser(object) {
  return User.partial().safeParse(object);
}
