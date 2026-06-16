"use client";

import { useActionState } from "react";
import {
  createCategoryAction,
  updateCategoryAction,
  type ActionState,
} from "@/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

const initialState: ActionState = {};

interface CategoryFormProps {
  category?: {
    id: string;
    name: string;
    sortOrder: number;
    active: boolean;
  };
}

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          Category name
        </label>
        <Input id="name" name="name" defaultValue={category?.name ?? ""} required />
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
          defaultValue={category?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <Checkbox name="active" defaultChecked={category?.active ?? true} />
        Active
      </label>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : category ? "Update category" : "Create category"}
      </Button>
    </form>
  );
}
