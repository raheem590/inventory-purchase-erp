"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { uomSchema } from "@/lib/validations";
import type { ActionState } from "@/actions/categories";

export async function getUnits(includeInactive = false) {
  await requireAuth();
  return prisma.unitOfMeasure.findMany({
    where: includeInactive ? undefined : { active: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });
}

export async function getUnit(id: string) {
  await requireAuth();
  return prisma.unitOfMeasure.findUnique({ where: { id } });
}

export async function createUnitAction(
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = uomSchema.safeParse({
    name: formData.get("name"),
    abbreviation: formData.get("abbreviation"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.unitOfMeasure.findFirst({
    where: {
      OR: [{ name: parsed.data.name }, { abbreviation: parsed.data.abbreviation }],
    },
  });

  if (existing) {
    return { error: "Unit name or abbreviation already exists" };
  }

  await prisma.unitOfMeasure.create({ data: parsed.data });
  revalidatePath("/admin/uom");
  revalidatePath("/admin/products");
  return { success: "Unit created" };
}

export async function updateUnitAction(
  id: string,
  _prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAuth();

  const parsed = uomSchema.safeParse({
    name: formData.get("name"),
    abbreviation: formData.get("abbreviation"),
    sortOrder: formData.get("sortOrder") || 0,
    active: formData.get("active") === "on" || formData.get("active") === "true",
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid data" };
  }

  const existing = await prisma.unitOfMeasure.findFirst({
    where: {
      OR: [{ name: parsed.data.name }, { abbreviation: parsed.data.abbreviation }],
      NOT: { id },
    },
  });

  if (existing) {
    return { error: "Unit name or abbreviation already exists" };
  }

  await prisma.unitOfMeasure.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/admin/uom");
  revalidatePath(`/admin/uom/${id}`);
  revalidatePath("/admin/products");
  return { success: "Unit updated" };
}
