import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Plat } from "../types/database";

export default function CataloguePlats() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function chargerPlats() {
      setChargement(true);
      const { data, error } = await supabase
        .from("plats")
        .select("*, restaurants(*)")
        .eq("disponible", true);

      if (error) {
        setErreur(error.message);
      } else {
        setPlats(data as Plat[]);
      }
      setChargement(false);
    }

    chargerPlats();
  }, []);

  if (chargement) return <p>Chargement des plats...</p>;
  if (erreur) return <p>Erreur : {erreur}</p>;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Dily resto</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plats.map((plat) => (
          <div
            key={plat.id}
            onClick={() => navigate(`/restaurant/${plat.restaurant_id}`)}
            style={{
              display: "flex",
              gap: 12,
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{plat.nom}</p>
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
                {plat.restaurants?.nom}
                {plat.restaurants?.certifie_hygiene && " · Certifié"}
              </p>
              <p style={{ fontWeight: 600, margin: 0 }}>{plat.prix} FCFA</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
