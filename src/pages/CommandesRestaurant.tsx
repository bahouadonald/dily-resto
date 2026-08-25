import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Commande, Restaurant } from "../types/database";

export default function CommandesRestaurant() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerDonnees();
    const intervalle = setInterval(chargerDonnees, 20000);
    return () => clearInterval(intervalle);
  }, []);

  async function chargerDonnees() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setChargement(false);
      return;
    }

    const { data: restaurantData } = await supabase
      .from("restaurants")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (!restaurantData) {
      setChargement(false);
      return;
    }

    setRestaurant(restaurantData as Restaurant);

    const { data: commandesData } = await supabase
      .from("commandes")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .in("statut", ["confirmee", "hors_fenetre", "en_preparation", "prete"])
      .order("created_at", { ascending: true });

    setCommandes((commandesData as Commande[]) || []);
    setChargement(false);
  }

  async function marquerPrete(commandeId: string) {
    await supabase
      .from("commandes")
      .update({ statut: "prete" })
      .eq("id", commandeId);
    chargerDonnees();
  }

  async function commencerPreparation(commandeId: string) {
    await supabase
      .from("commandes")
      .update({ statut: "en_preparation" })
      .eq("id", commandeId);
    chargerDonnees();
  }

  if (chargement) return <p>Chargement...</p>;
  if (!restaurant) return <p>Profil restaurant introuvable.</p>;

  const commandesFenetre = commandes.filter((c) => c.statut !== "hors_fenetre");
  const commandesTardives = commandes.filter((c) => c.statut === "hors_fenetre");

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h1>{restaurant.nom} — Commandes</h1>

      {commandesTardives.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, color: "#b45309" }}>
            ⚠️ Commandes tardives — à préparer maintenant
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {commandesTardives.map((c) => (
              <div
                key={c.id}
                style={{
                  padding: 10,
                  border: "1px solid #f59e0b",
                  background: "#fffbeb",
                  borderRadius: 12,
                }}
              >
                <p style={{ margin: 0, fontWeight: 600 }}>
                  Commande #{c.id.slice(0, 8)} — hors fenêtre
                </p>
                <p style={{ fontSize: 13, color: "#92400e", margin: "4px 0" }}>
                  Reçue après la fermeture de la fenêtre de commande. Un
                  livreur passera la récupérer une fois prête, mais pas
                  immédiatement.
                </p>
                {c.statut === "hors_fenetre" && (
                  <button onClick={() => commencerPreparation(c.id)}>
                    Commencer la préparation
                  </button>
                )}
                {c.statut === "en_preparation" && (
                  <button onClick={() => marquerPrete(c.id)}>
                    Marquer prête
                  </button>
                )}
                {c.statut === "prete" && (
                  <p style={{ color: "green", fontWeight: 600 }}>✓ Prête, en attente de récupération</p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      <h2 style={{ fontSize: 16 }}>Commandes de la fenêtre en cours</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {commandesFenetre.map((c) => (
          <div
            key={c.id}
            style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>
              Commande #{c.id.slice(0, 8)}
            </p>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
              Statut : {c.statut}
            </p>
            {c.statut === "confirmee" && (
              <button onClick={() => commencerPreparation(c.id)}>
                Commencer la préparation
              </button>
            )}
            {c.statut === "en_preparation" && (
              <button onClick={() => marquerPrete(c.id)}>
                Marquer prête
              </button>
            )}
            {c.statut === "prete" && (
              <p style={{ color: "green", fontWeight: 600 }}>✓ Prête, en attente de récupération</p>
            )}
          </div>
        ))}
        {commandesFenetre.length === 0 && <p>Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}
