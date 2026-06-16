"use client";

import { useActionState } from "react";
import { createUnitAction, updateUnitAction } from "@/actions/uom";
import type { ActionState } from "@/actions/categories";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Input } from "@/components/ui/Input";

const initialState: ActionState = {};

interface UomFormProps {
  unit?: {
    id: string;
    name: string;
    abbreviation: string;
    sortOrder: number;
    active: boolean;
  };
}

export function UomForm({ unit }: UomFormProps) {
  const action = unit ? updateUnitAction.bind(null, unit.id) : createUnitAction;
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
          Unit name
        </label>
        <Input id="name" name="name" defaultValue={unit?.name ?? ""} required />
      </div>
      <div>
        <label
          htmlFor="abbreviation"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Abbreviation
        </label>
        <Input
          id="abbreviation"
          name="abbreviation"
          defaultValue={unit?.abbreviation ?? ""}
          required
        />
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
          defaultValue={unit?.sortOrder ?? 0}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <Checkbox name="active" defaultChecked={unit?.active ?? true} />
        Active
      </label>
      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-600">{state.success}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving..." : unit ? "Update unit" : "Create unit"}
      </Button>
    </form>
  );
}
