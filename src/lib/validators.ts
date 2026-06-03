import z from "zod";

// Syrian Regular Expressions
const syrianIntlRegex = /^\+9639[1-689]\d{7}$/;
const syrianLocalRegex = /^09[1-689]\d{7}$/;

// Japanese Mobile Regular Expressions
const japanIntlRegex = /^\+81[789]0\d{8}$/;
const japanLocalRegex = /^0[789]0\d{8}$/;

export type UserAuthInput = z.infer<typeof userAuthSchema>;
export const userAuthSchema = z.object({
  first_name: z
    .string()
    .min(2, { message: "First Name must be at least 2 characters long." })
    .max(50, { message: "First Name cannot exceed 50 characters." }),
  last_name: z
    .string()
    .min(2, { message: "Last Name must be at least 2 characters long." })
    .max(50, { message: "Last Name cannot exceed 50 characters." }),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email({ message: "Invalid email address format." })),
  phone: z
    .string()
    .trim()
    // Remove optional hyphens/spaces
    .transform((val) => val.replace(/[- ]/g, ""))
    // Validate against either country's local or international pattern
    .refine(
      (val) =>
        syrianIntlRegex.test(val) ||
        syrianLocalRegex.test(val) ||
        japanIntlRegex.test(val) ||
        japanLocalRegex.test(val),
      {
        message:
          "Must be a valid Syrian (+963) or Japanese (+81) mobile number.",
      },
    )
    //Normalize everything to a strict international E.164 format
    .transform((val) => {
      if (val.startsWith("09")) {
        return `+963${val.slice(1)}`;
      }
      if (/^0[789]0/.test(val)) {
        return `+81${val.slice(1)}`;
      }
      return val;
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number." }),
  role: z.enum(["BUYER", "SELLER"]),
});
