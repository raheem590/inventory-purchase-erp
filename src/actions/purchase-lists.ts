"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { parseDateInput } from "@/lib/utils";
import { purchaseListSchema } from "@/lib/validations";
import type { ActionState } from "@/actions/categories";

export async function getPurchaseListsByDate(dateStr: string) {
  await requireAuth();
  const listDate = parseDateInput(dateStr);

  return prisma.purchaseList.findMany({
    where: { listDate },
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: { select: { items: true } },
    },
  });
}

export async function getPurchaseList(id: string) {
  await requireAuth();
  return prisma.purchaseList.findUnique({
    where: { id },
    include: {
      category: true,
      items: {
        include: { product: { include: { uom: true } } },
        orderBy: { product: { sortOrder: "asc" } },
      },
    },
  });
}

export async function createPurchaseListAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const categoryId = String(formData.get("categoryId") ?? "");
  const listDate = String(formData.get("listDate") ?? "");
  const productIds = formData.getAll("productId").map(String);
  const quantities = formData.getAll("quantity").map(String);

  const items = productIds
    .map((productId, index) => ({
      productId,
      quantity: Number(quantities[index]),
    }))
    .filter((item) => item.productId && item.quantity > 0);

  const parsed = purchaseListSchema.safeParse({
    categoryId,
    listDate,
    items,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid purchase list" };
  }

  const purchaseList = await prisma.purchaseList.create({
    data: {
      categoryId: parsed.data.categoryId,
      listDate: parseDateInput(parsed.data.listDate),
      items: {
        create: parsed.data.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    },
  });

  revalidatePath("/purchase/history");
  redirect(`/purchase/${purchaseList.id}`);
}
