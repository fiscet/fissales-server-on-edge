import z from "zod";

export const customerOutputSchema = z.object({
  response: z.string(),
  suggested_products: z.array(z.object({
    product_id: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
    image: z.string(),
    url: z.string(),
  })).optional(),
});