"use client";

import { useActionState } from "react";
import {
  createProductAction,
  updateProductAction,
} from "@/actions/products";
import type { ActionState } from "@/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";

const initialState: ActionState = {};

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
  product?: {
    id: string;
    name: string;
    categoryId: string;
    sortOrder: number;
    active: boolean;
  };
}

export function ProductForm({ categories, product }: ProductFormProps) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          Product name
        </label>
        <Input id="name" name="name" defaultValue={product?.name ?? ""} required />
      </div>
      <div>
        <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-slate-700">
          Category
        </label>
        <Select
          id="categoryId"
          name="categoryId"
          defaultValue={product?.categoryId ?? categories[0]?.id ?? ""}
          required
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <label htmlFor="sortOrder" className="mb-2 block text-sm font-medium text-slate-700">
          Sort order
        </label>
        <Input
          id="sortOrder"
          name="sortOrder"
          type="number"
          min={0}
          defaultValue={product?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <Checkbox name="active" defaultChecked={product?.active ?? true} />
        Active
      </label>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : product ? "Update product" : "Create product"}
      </Button>
    </form>
  );
}
