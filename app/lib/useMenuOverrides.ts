"use client";
import { useEffect, useState } from "react";

export type Override = { item_id: string; out_of_stock: boolean; hidden: boolean };

export function useMenuOverrides() {
  const [overrides, setOverrides] = useState<Override[]>([]);

  useEffect(() => {
    fetch("/api/admin/menu")
      .then((r) => r.json())
      .then(({ overrides }) => setOverrides(overrides ?? []))
      .catch(() => {});
  }, []);

  const isHidden = (id: string) => overrides.find((o) => o.item_id === id)?.hidden ?? false;
  const isOOS    = (id: string) => overrides.find((o) => o.item_id === id)?.out_of_stock ?? false;

  return { overrides, isHidden, isOOS };
}
