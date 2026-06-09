import z from "zod/v4";

// Syrian Regular Expressions
const syrianIntlRegex = /^\+9639[1-689]\d{7}$/;
const syrianLocalRegex = /^09[1-689]\d{7}$/;

// Japanese Mobile Regular Expressions
const japanIntlRegex = /^\+81[789]0\d{8}$/;
const japanLocalRegex = /^0[789]0\d{8}$/;

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, {
    message: "Password must contain at least one uppercase letter.",
  })
  .regex(/[a-z]/, {
    message: "Password must contain at least one lowercase letter.",
  })
  .regex(/[0-9]/, { message: "Password must contain at least one number." });

const phoneSchema = z
  .string()
  .trim()
  .transform((val) => val.replace(/[- ]/g, ""))
  .refine(
    (val) =>
      syrianIntlRegex.test(val) ||
      syrianLocalRegex.test(val) ||
      japanIntlRegex.test(val) ||
      japanLocalRegex.test(val),
    {
      message: "Must be a valid Syrian (+963) or Japanese (+81) mobile number.",
    },
  )
  .transform((val) => {
    if (val.startsWith("09")) {
      return `+963${val.slice(1)}`;
    }
    if (/^0[789]0/.test(val)) {
      return `+81${val.slice(1)}`;
    }
    return val;
  });
const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .optional()
  .refine((val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
    message: "Invalid email address format.",
  });
export const userAuthSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters long." })
    .max(50, { message: "First Name cannot exceed 50 characters." }),
  last_name: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters long." })
    .max(50, { message: "Last Name cannot exceed 50 characters." }),
  email: emailSchema,
  phone: phoneSchema,
  password: passwordSchema,
  role: z.union([z.literal("BUYER"), z.literal("SELLER")]),
});
// Login Auth Schema
export const loginSchema = z.object({
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const sellerStoreSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Store name must be at least 2 characters long." })
    .max(50, { message: "Store name cannot exceed 50 characters." }),
  description: z.string().optional(),
  location: z.string().optional(),
});
export type CreateStore = z.infer<typeof sellerStoreSchema>;
export type UserAuthInput = z.infer<typeof userAuthSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
