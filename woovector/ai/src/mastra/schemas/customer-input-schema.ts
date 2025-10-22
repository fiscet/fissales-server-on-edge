import z from "zod";

export const customerInputSchema = z.object({
  message: z.string(),
  session_id: z.string(),
  customer_id: z.string().optional(),
  order_history: z.array(z.object({
    product_id: z.string(),
    quantity: z.number(),
    price: z.number(),
    purchase_date: z.string(),
  })).optional(),
  cart_items: z.array(z.object({
    product_id: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).optional(),
});