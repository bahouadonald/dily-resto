import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Plat } from "../types/database";

export interface LignePanier {
  plat: Plat;
  quantite: number;
}

interface CartContextType {
  lignes: LignePanier[];
  ajouterAuPanier: (plat: Plat) => void;
  retirerDuPanier: (platId: string) => void;
  changerQuantite: (platId: string, quantite: number) => void;
  viderPanier: () => void;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lignes, setLignes] = useState<LignePanier[]>(() => {
    const sauvegarde = localStorage.getItem("dily-resto-panier");
    return sauvegarde ? JSON.parse(sauvegarde) : [];
  });

  useEffect(() => {
    localStorage.setItem("dily-resto-panier", JSON.stringify(lignes));
  }, [lignes]);

  function ajouterAuPanier(plat: Plat) {
    setLignes((prev) => {
      const existante = prev.find((l) => l.plat.id === plat.id);
      if (existante) {
        return prev.map((l) =>
          l.plat.id === plat.id ? { ...l, quantite: l.quantite + 1 } : l
        );
      }
      return [...prev, { plat, quantite: 1 }];
    });
  }

  function retirerDuPanier(platId: string) {
    setLignes((prev) => prev.filter((l) => l.plat.id !== platId));
  }

  function changerQuantite(platId: string, quantite: number) {
    if (quantite <= 0) {
      retirerDuPanier(platId);
      return;
    }
    setLignes((prev) =>
      prev.map((l) => (l.plat.id === platId ? { ...l, quantite } : l))
    );
  }

  function viderPanier() {
    setLignes([]);
  }

  const total = lignes.reduce((somme, l) => somme + l.plat.prix * l.quantite, 0);

  return (
    <CartContext.Provider
      value={{ lignes, ajouterAuPanier, retirerDuPanier, changerQuantite, viderPanier, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}
