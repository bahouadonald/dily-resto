import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function useNotificationsRestaurant(restaurantId: string | null) {
  const [derniereNotification, setDerniereNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) return;

    const canal = supabase
      .channel(`commandes-restaurant-${restaurantId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "commandes",
          filter: `restaurant_id=eq.${restaurantId}`,
        },
        () => {
          setDerniereNotification("Nouvelle commande reçue !");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [restaurantId]);

  return derniereNotification;
}

export function useNotificationsLivreur(livreurId: string | null) {
  const [derniereNotification, setDerniereNotification] = useState<string | null>(null);

  useEffect(() => {
    if (!livreurId) return;

    const canal = supabase
      .channel(`tournees-livreur-${livreurId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "tournees",
          filter: `livreur_id=eq.${livreurId}`,
        },
        () => {
          setDerniereNotification("Une tournée t'a été assignée !");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [livreurId]);

  return derniereNotification;
}
