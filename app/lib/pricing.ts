// Authoritative, server-side pricing. NEVER trust amounts sent by the browser —
// always recompute here from item ids and session params.
import { BEVERAGES, SNACKS } from "@/app/components/addonsData";

const PRICE_BY_ID: Record<string, number> = {};
for (const it of [...BEVERAGES, ...SNACKS]) PRICE_BY_ID[it.id] = it.price;

export type CartLine = { id?: string; quantity?: number | string };

export function cartTotal(cart: unknown): number {
  if (!Array.isArray(cart)) return 0;
  return cart.reduce((sum: number, line: CartLine) => {
    const price = line && typeof line.id === "string" ? PRICE_BY_ID[line.id] : undefined;
    if (!price) return sum; // unknown id → ignore (can't be charged)
    const qty = Math.max(0, Math.min(99, parseInt(String(line.quantity)) || 0));
    return sum + price * qty;
  }, 0);
}

export function sessionTotal(players: unknown, hours: unknown): number {
  const p = Math.max(1, Math.min(50, parseInt(String(players)) || 1));
  const h = Math.max(1, Math.min(12, parseInt(String(hours)) || 1));
  // Solo gets a dedicated console at ₹200/hr; groups share at ₹150/person/hr.
  return p === 1 ? 200 * h : 150 * p * h;
}
