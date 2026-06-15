"use client";
import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  quantity: number;
}

interface Ctx {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">, qty: number) => void;
  updateQty: (id: string, delta: number) => void;
  removeItem: (id: string) => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<Ctx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((item: Omit<CartItem, "quantity">, qty: number) => {
    setCart((prev) => {
      const ex = prev.find((i) => i.id === item.id);
      if (ex) return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { ...item, quantity: qty }];
    });
  }, []);

  const updateQty = useCallback((id: string, delta: number) => {
    setCart((prev) =>
      prev.map((i) => i.id === id ? { ...i, quantity: i.quantity + delta } : i)
          .filter((i) => i.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQty, removeItem, totalItems, totalPrice, isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false) }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart outside CartProvider");
  return ctx;
}
