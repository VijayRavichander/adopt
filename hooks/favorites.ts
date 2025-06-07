"use client";
import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "favoriteDogIds";

/**
 * Hook that exposes a Set of favourite IDs and a toggle function.
 */
export function useFavoriteDogs() {
  // Lazily create an empty Set; we’ll hydrate in useEffect.
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  // Hydrate once after the component mounts (client side only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setFavorites(new Set(JSON.parse(raw)));
    } catch (e) {
      console.error("Could not read favourites from localStorage", e);
    }
  }, []);

  // Memoised toggle keeps reference stable.
  const toggle = useCallback((id: string) =>
    setFavorites(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      // Persist to storage **after** computing the next value.
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
      return next;
    }), []);

  return { favorites, toggle };
}
