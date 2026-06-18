"use client";

import { useMemo, useState } from "react";
import { useActionState } from "react";
import { Plus, Search } from "lucide-react";
import { createPurchaseListAction } from "@/actions/purchase-lists";
import { quickAddProductAction } from "@/actions/products";
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
  displayName: string;
  categoryId: string;
}

interface UnitOption {
  id: string;
  name: string;
  abbreviation: string;
}

interface PurchaseListFormProps {
  categories: CategoryOption[];
  products: ProductOption[];
  units: UnitOption[];
}

export function PurchaseListForm({
  categories,
  products: initialProducts,
  units,
}: PurchaseListFormProps) {
  const [state, formAction, pending] = useActionState(
    createPurchaseListAction,
    initialState,
  );
  const [products, setProducts] = useState(initialProducts);
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [quickAddUomId, setQuickAddUomId] = useState(units[0]?.id ?? "");
  const [quickAddPending, setQuickAddPending] = useState(false);
  const [quickAddError, setQuickAddError] = useState<string | null>(null);

  const currentCategory = categories.find((category) => category.id === categoryId);

  const categoryProducts = useMemo(
    () => products.filter((product) => product.categoryId === categoryId),
    [products, categoryId],
  );

  const visibleProducts = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return categoryProducts;
    return categoryProducts.filter((product) =>
      product.displayName.toLowerCase().includes(query),
    );
  }, [categoryProducts, search]);

  const hasExactNameMatch = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return false;
    return categoryProducts.some(
      (product) => product.name.toLowerCase() === query,
    );
  }, [categoryProducts, search]);

  const showQuickAdd =
    search.trim().length > 0 &&
    visibleProducts.length === 0 &&
    !hasExactNameMatch;

  function toggleProduct(productId: string, checked: boolean) {
    setSelected((prev) => ({ ...prev, [productId]: checked }));
    if (!checked) {
      setQuantities((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } else if (!quantities[productId]) {
      setQuantities((prev) => ({ ...prev, [productId]: "1" }));
    }
  }

  async function handleQuickAdd() {
    const trimmedName = search.trim();
    if (!trimmedName || !quickAddUomId) return;

    setQuickAddPending(true);
    setQuickAddError(null);

    const result = await quickAddProductAction(trimmedName, categoryId, quickAddUomId);

    setQuickAddPending(false);

    if ("error" in result) {
      setQuickAddError(result.error);
      return;
    }

    const { product } = result;

    setProducts((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                name: product.name,
                displayName: product.displayName,
                categoryId: product.categoryId,
              }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          displayName: product.displayName,
          categoryId: product.categoryId,
        },
      ];
    });

    setSelected((prev) => ({ ...prev, [product.id]: true }));
    setQuantities((prev) => ({ ...prev, [product.id]: "1" }));
    setSearch("");
    setQuickAddError(null);
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
                setQuickAddError(null);
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
              onChange={(event) => {
                setSearch(event.target.value);
                setQuickAddError(null);
              }}
              className="pl-10"
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {selectedCount} selected · {visibleProducts.length} shown
          </p>
        </div>

        {showQuickAdd ? (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50/80 p-4">
            <p className="text-sm font-medium text-amber-900">
              &quot;{search.trim()}&quot; not found in {currentCategory?.name ?? "this category"}.
              Add it now?
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div>
                <label
                  htmlFor="quickAddUom"
                  className="mb-1 block text-xs font-semibold text-slate-600"
                >
                  Unit of measure
                </label>
                <Select
                  id="quickAddUom"
                  value={quickAddUomId}
                  onChange={(event) => setQuickAddUomId(event.target.value)}
                >
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.name} ({unit.abbreviation})
                    </option>
                  ))}
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleQuickAdd}
                  disabled={quickAddPending || !quickAddUomId}
                  className="w-full gap-2 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  {quickAddPending ? "Adding..." : "Add and select"}
                </Button>
              </div>
            </div>
            {quickAddError ? (
              <p className="mt-2 text-sm text-rose-700">{quickAddError}</p>
            ) : null}
          </div>
        ) : null}

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
              {categoryProducts.length === 0 && !showQuickAdd ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-sm text-slate-500">
                    No active products in this category.
                  </td>
                </tr>
              ) : visibleProducts.length === 0 && !showQuickAdd ? (
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
                        {product.displayName}
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

      {products
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
      <Button
        type="submit"
        disabled={pending || selectedCount === 0}
        className="w-full sm:w-auto"
      >
        {pending ? "Saving..." : "Save purchase list"}
      </Button>
    </form>
  );
}
