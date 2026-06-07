import { create } from "zustand";

interface ItemsType {
  name: string;
  quantity: number;
  image: string;
  price: number;
  stock: number;
  storeId: number;
  productId: number;
}
interface useCartStoreType {
  items: ItemsType[];
  addItem: (item: ItemsType) => void;
  removeItem: (productId: number) => void;
  changeQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}
export const useCartStore = create<useCartStoreType>((set) => ({
  items: [],
  addItem: (newItem) =>
    set((state) => {
      const itemExists = state.items.find(
        (product) => product.productId === newItem.productId,
      );
      if (itemExists) {
        return {
          items: state.items.map((item) => {
            return item.productId === newItem.productId
              ? {
                  ...item,
                  quantity: item.quantity + newItem.quantity,
                }
              : item;
          }),
        };
      }
      return {
        items: [...state.items, newItem],
      };
    }),
  removeItem: (productId) =>
    set((state) => {
      const filteredCartItem = state.items.filter(
        (item) => item.productId !== productId,
      );
      return {
        items: filteredCartItem,
      };
    }),
  changeQuantity: (productId, quantity) =>
    set((state) => {
      return {
        items: state.items.map((item) => {
          return item.productId === productId
            ? {
                ...item,
                quantity,
              }
            : item;
        }),
      };
    }),
  clearCart: () => set({ items: [] }),
}));
