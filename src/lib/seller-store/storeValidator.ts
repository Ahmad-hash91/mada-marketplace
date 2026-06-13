import z from "zod";

export const inputSearchSchema = z.object({
  searchQuery: z.string().trim().toLowerCase().min(2, {
    message: "search Query must be at least 2 characters long.",
  }),
});
export type SellerSearchInput = z.infer<typeof inputSearchSchema>;
