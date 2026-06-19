import z from "zod";

const nameSchema = z
  .string()
  .trim()
  .min(2, { error: "Product name must be at least 2 characters long." })
  .max(50, { error: "Product name can be only 50 characters long." });

const descriptionSchema = z
  .string()
  .trim()
  .max(150, { error: "Product description can be 150 character long." })
  .optional();

const priceSchema = z.number().positive();

const stockSchema = z.number().nonnegative();

const categoryIdSchema = z.number().positive();

export const addNewProductSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
  price: priceSchema,
  stock: stockSchema,
  categoryId: categoryIdSchema,
});

export type addNewProductSchemaProps = z.infer<typeof addNewProductSchema>;
