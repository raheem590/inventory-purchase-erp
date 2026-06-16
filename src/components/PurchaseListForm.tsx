"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { createPurchaseListAction } from "@/actions/purchase-lists";
import type { ActionState } from "@/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { toDateInputValue } from "@/lib/utils";

const initialState: ActionState = {};

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductOption {
  id: string;
  name: string;
  categoryId: string;
}

interface PurchaseListFormProps {
  categories: CategoryOption[];
  products: ProductOption[];
}

export function PurchaseListForm({ categories, products }: PurchaseListFormProps) {
  const [state, formAction, pending] = useActionState(
    createPurchaseListAction,
    initialState,
  );
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(
    () => products.filter((product) => product.categoryId === categoryId),
    [products, categoryId],
  );

  function toggleProduct(productId: string, checked: boolean) {
    setSelected((prev) => ({ ...prev, [productId]: checked }));
    if (!checked) {
      setQuantities((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="categoryId" className="mb-2 block text-sm font-medium text-slate-700">
            Category
          </label>
          <Select
            id="categoryId"
            name="categoryId"
            value={categoryId}
            onChange={(event) => {
              setCategoryId(event.target.value);
              setSelected({});
              setQuantities({});
            }}
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
          <label htmlFor="listDate" className="mb-2 block text-sm font-medium text-slate-700">
            List date
          </label>
          <Input
            id="listDate"
            name="listDate"
            type="date"
            defaultValue={toDateInputValue()}
            required
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Select
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Product
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                Quantity
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-sm text-slate-500">
                  No active products in this category.
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const isChecked = Boolean(selected[product.id]);
                return (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={isChecked}
                        onChange={(event) =>
                          toggleProduct(product.id, event.target.checked)
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-900">{product.name}</td>
                    <td className="px-4 py-3">
                      {isChecked ? (
                        <>
                          <input type="hidden" name="productId" value={product.id} />
                          <Input
                            name="quantity"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={quantities[product.id] ?? "1"}
                            onChange={(event) =>
                              setQuantities((prev) => ({
                                ...prev,
                                [product.id]: event.target.value,
                              }))
                            }
                            required
                          />
                        </>
                      ) : (
                        <span className="text-sm text-slate-400">Check item first</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}
      <Button type="submit" disabled={pending || filteredProducts.length === 0}>
        {pending ? "Saving..." : "Save purchase list"}
      </Button>
    </form>
  );
}
