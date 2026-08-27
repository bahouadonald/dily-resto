import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Livraison() {
  const { total, lignes } = useCart();
  const navigate = useNavigate();
  const [lieu, setLieu] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [telephone, setTelephone] = useState("");
  const [fraisLivraison, setFraisLivraison] = useState(0);
  const [livraisonGratuite, setLivraisonGratuite] = useState(false);
  const [chargement, setChargement] = useState(true);

  const FRAIS_MIN = 150;
  const FRAIS_MAX = 300;
  const NB_LIVRAISONS_GRATUITES = 5;

  useEffect(() => {
    calculerFrais();
  }, []);

  async function calculerFrais() {
    setChargement(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setFraisLivraison(FRAIS_MIN);
      setChargement(false);
      return;
    }

    const { data: travailleur } = await supabase
      .from("travailleurs")
      .select("id, latitude, longitude, zone_id")
      .eq("auth_user_id", user.id)
      .single();

    if (!travailleur) {
      setFraisLivraison(FRAIS_MIN);
      setChargement(false);
      return;
    }

    // Vérifier le nombre de livraisons déjà effectuées par ce travailleur
    const { count } = await supabase
      .from("commandes")
      .select("*", { count: "exact", head: true })
      .eq("travailleur_id", travailleur.id)
      .in("statut", ["confirmee", "en_preparation", "prete", "en_livraison", "livree"]);

    if ((count || 0) < NB_LIVRAISONS_GRATUITES) {
      setLivraisonGratuite(true);
      setFraisLivraison(0);
      setChargement(false);
      return;
    }

    // Calcul selon la distance restaurant → travailleur
    const restaurantId = lignes[0]?.plat.restaurant_id;
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("latitude, longitude")
      .eq("id", restaurantId)
      .single();

    const { data: zone } = await supabase
      .from("zones")
      .select("rayon_km")
      .eq("id", travailleur.zone_id)
      .single();

    if (restaurant && travailleur.latitude && zone) {
      const distance = distanceKm(
        restaurant.latitude,
        restaurant.longitude,
        travailleur.latitude,
        travailleur.longitude
      );
      const rayonMax = zone.rayon_km || 3;
      const proportion = Math.min(distance / rayonMax, 1);
      const frais = Math.round(FRAIS_MIN + proportion * (FRAIS_MAX - FRAIS_MIN));
      setFraisLivraison(frais);
    } else {
      setFraisLivraison(FRAIS_MIN);
    }

    setChargement(false);
  }

  function continuer() {
    if (!lieu || !telephone) return;
    localStorage.setItem(
      "dily-resto-livraison",
      JSON.stringify({ lieu, entreprise, telephone, fraisLivraison })
    );
    navigate("/paiement");
  }

  if (chargement) return <p>Calcul des frais de livraison...</p>;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Retour
      </button>
      <h1>Où livrer ?</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <label>
          Lieu de travail / adresse
          <input
            type="text"
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            placeholder="Ex : Plateau, immeuble X, 3e étage"
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Entreprise (optionnel)
          <input
            type="text"
            value={entreprise}
            onChange={(e) => setEntreprise(e.target.value)}
            placeholder="Nom de l'entreprise"
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Téléphone
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="07 00 00 00 00"
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>
      </div>

      <div style={{ marginTop: 24, borderTop: "1px solid #eee", paddingTop: 12 }}>
        <p>Sous-total : {total} FCFA</p>
        <p>
          Livraison :{" "}
          {livraisonGratuite ? (
            <span style={{ color: "var(--dily-vert)", fontWeight: 700 }}>Gratuite 🎁</span>
          ) : (
            `${fraisLivraison} FCFA`
          )}
        </p>
        <p style={{ fontWeight: 700, fontSize: 18 }}>
          Total : {total + fraisLivraison} FCFA
        </p>

        <button
          onClick={continuer}
          disabled={!lieu || !telephone}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: !lieu || !telephone ? "#ccc" : "var(--dily-vert)",
            color: "white",
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Continuer vers le paiement
        </button>
      </div>
    </div>
  );
}
