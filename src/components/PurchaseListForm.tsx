"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { Search } from "lucide-react";
import { createPurchaseListAction } from "@/actions/purchase-lists";
import type { ActionState } from "@/actions/categories";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { Card } from "@/components/ui/Card";
import { cn, toDateInputValue } from "@/lib/utils";

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
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const categoryProducts = useMemo(
    () => products.filter((product) => product.categoryId === categoryId),
    [products, categoryId],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categoryProducts;
    return categoryProducts.filter((product) =>
      product.name.toLowerCase().includes(query),
    );
  }, [categoryProducts, search]);

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

  const selectedCount = Object.values(selected).filter(Boolean).length;

  return (
    <form action={formAction} className="space-y-6">
      <Card accent="emerald">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="categoryId" className="mb-2 block text-sm font-semibold text-slate-700">
              Category
            </label>
            <Select
              id="categoryId"
              name="categoryId"
              value={categoryId}
              onChange={(event) => {
                setCategoryId(event.target.value);
                setSearch("");
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
            <label htmlFor="listDate" className="mb-2 block text-sm font-semibold text-slate-700">
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
      </Card>

      <Card accent="blue">
        <div className="mb-4">
          <label htmlFor="productSearch" className="mb-2 block text-sm font-semibold text-slate-700">
            Search products
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              id="productSearch"
              type="search"
              placeholder="Type to filter products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {selectedCount} selected · {visibleProducts.length} shown
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-500">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Select</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Product</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {categoryProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                    No active products in this category.
                  </td>
                </tr>
              ) : visibleProducts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                    No products match your search.
                  </td>
                </tr>
              ) : (
                visibleProducts.map((product) => {
                  const isChecked = Boolean(selected[product.id]);
                  return (
                    <tr
                      key={product.id}
                      className={cn(
                        "transition-colors",
                        isChecked && "bg-emerald-50",
                      )}
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={isChecked}
                          onChange={(event) =>
                            toggleProduct(product.id, event.target.checked)
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-slate-900">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">
                        {isChecked ? (
                          <Input
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
                            className="max-w-28"
                          />
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
      </Card>

      {categoryProducts
        .filter((product) => selected[product.id])
        .map((product) => (
          <div key={`hidden-${product.id}`} className="hidden" aria-hidden>
            <input type="hidden" name="productId" value={product.id} />
            <input type="hidden" name="quantity" value={quantities[product.id] ?? "1"} />
          </div>
        ))}

      {state.error ? (
        <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{state.error}</p>
      ) : null}
      <Button type="submit" disabled={pending || categoryProducts.length === 0} className="w-full sm:w-auto">
        {pending ? "Saving..." : "Save purchase list"}
      </Button>
    </form>
  );
}
