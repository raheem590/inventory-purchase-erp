import { z } from "zod";

export const pinSchema = z
  .string()
  .length(6, "PIN must be exactly 6 digits")
  .regex(/^\d{6}$/, "PIN must contain only digits");

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  categoryId: z.string().min(1, "Category is required"),
  sortOrder: z.coerce.number().int().min(0).default(0),
  active: z.coerce.boolean().default(true),
});

export const purchaseListItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().positive("Quantity must be greater than 0"),
});

export const purchaseListSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  listDate: z.string().min(1, "Date is required"),
  items: z.array(purchaseListItemSchema).min(1, "Select at least one item"),
});

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
