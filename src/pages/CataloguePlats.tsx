import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import type { Plat } from "../types/database";

export default function CataloguePlats() {
  const [plats, setPlats] = useState<Plat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [pasDeCompte, setPasDeCompte] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    chargerPlats();
  }, []);

  async function chargerPlats() {
    setChargement(true);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setPasDeCompte(true);
      setChargement(false);
      return;
    }

    const { data: travailleur } = await supabase
      .from("travailleurs")
      .select("zone_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!travailleur) {
      setPasDeCompte(true);
      setChargement(false);
      return;
    }

    let requete = supabase
      .from("plats")
      .select("*, restaurants!inner(*)")
      .eq("disponible", true)
      .eq("restaurants.statut", "actif");

    if (travailleur.zone_id) {
      requete = requete.eq("restaurants.zone_id", travailleur.zone_id);
    }

    const { data, error } = await requete;

    if (error) {
      setErreur(error.message);
    } else {
      setPlats(data as Plat[]);
    }
    setChargement(false);
  }

  if (chargement) return <p>Chargement des plats...</p>;

  if (pasDeCompte) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: 40, textAlign: "center" }}>
        <h1 style={{ fontSize: 22 }}>Crée ton compte pour commander</h1>
        <p style={{ color: "#666", marginBottom: 24 }}>
          Il te faut un compte pour voir les restaurants de ta zone et passer
          commande.
        </p>
        <button
          onClick={() => navigate("/travailleur-inscription")}
          style={{
            padding: "14px 28px",
            borderRadius: 12,
            border: "none",
            background: "var(--dily-vert)",
            color: "white",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Créer mon compte
        </button>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          Déjà inscrit ? <a href="/connexion">Se connecter</a>
        </p>
      </div>
    );
  }

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
        {plats.length === 0 && <p>Aucun restaurant partenaire dans ta zone pour le moment.</p>}
      </div>
    </div>
  );
}
