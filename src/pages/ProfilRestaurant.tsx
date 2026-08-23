import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Restaurant, Plat } from "../types/database";

export default function ProfilRestaurant() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [plats, setPlats] = useState<Plat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    async function chargerProfil() {
      setChargement(true);

      const { data: restaurantData, error: erreurRestaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", id)
        .single();

      if (erreurRestaurant) {
        setErreur(erreurRestaurant.message);
        setChargement(false);
        return;
      }

      const { data: platsData, error: erreurPlats } = await supabase
        .from("plats")
        .select("*")
        .eq("restaurant_id", id)
        .eq("disponible", true);

      if (erreurPlats) {
        setErreur(erreurPlats.message);
      } else {
        setRestaurant(restaurantData as Restaurant);
        setPlats(platsData as Plat[]);
      }
      setChargement(false);
    }

    if (id) chargerProfil();
  }, [id]);

  if (chargement) return <p>Chargement du restaurant...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;
  if (!restaurant) return <p>Restaurant introuvable.</p>;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Retour
      </button>

      <div
        style={{
          height: 140,
          borderRadius: 12,
          background: "#f0f0f0",
          marginBottom: 12,
        }}
      />

      <h1 style={{ marginBottom: 4 }}>{restaurant.nom}</h1>

      {restaurant.certifie_hygiene && (
        <p style={{ color: "green", fontSize: 13, marginTop: 0 }}>
          ✓ Certifié hygiène
        </p>
      )}

      {restaurant.description && (
        <p style={{ color: "#555", fontSize: 14 }}>{restaurant.description}</p>
      )}

      <h2 style={{ marginTop: 24, fontSize: 18 }}>Menu</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plats.map((plat) => (
          <div
            key={plat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{plat.nom}</p>
              {plat.description && (
                <p style={{ fontSize: 12, color: "#666", margin: "4px 0" }}>
                  {plat.description}
                </p>
              )}
              <p style={{ fontWeight: 600, margin: 0 }}>{plat.prix} FCFA</p>
            </div>
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "#2E6F4E",
                color: "white",
              }}
            >
              Commander
            </button>
          </div>
        ))}
        {plats.length === 0 && <p>Aucun plat disponible pour le moment.</p>}
      </div>
    </div>
  );
}
