import type { Product } from "@prisma/client";
import { create } from "zustand";

type ProductState = {
  product: Product | null;
  productId: string | null;
  setProduct: (product: Product) => void;
  setProductId: (id: string) => void;
  resetProduct: () => void;
};

export const useProductStore = create<ProductState>()((set) => ({
  product: null,
  productId: null,
  setProduct: (product: Product) => set({ product }),
  setProductId: (id: string) => set({ productId: id }),
  resetProduct: () => set({ product: null, productId: null }),
}));
