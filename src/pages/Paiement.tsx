import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

export default function Paiement() {
  const { lignes, total, viderPanier } = useCart();
  const navigate = useNavigate();
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  const livraisonInfo = JSON.parse(
    localStorage.getItem("dily-resto-livraison") || "{}"
  );
  const fraisLivraison = livraisonInfo.fraisLivraison || 0;
  const totalFinal = total + fraisLivraison;

  async function payer() {
    setEnCours(true);
    setErreur(null);

    // Étape 1 : créer la commande dans Supabase
    // Note : travailleur_id et restaurant_id à connecter une fois l'auth en place
    const restaurantId = lignes[0]?.plat.restaurant_id;

    const { data: commande, error: erreurCommande } = await supabase
      .from("commandes")
      .insert({
        restaurant_id: restaurantId,
        montant_total: total,
        frais_livraison: fraisLivraison,
        statut: "en_attente",
      })
      .select()
      .single();

    if (erreurCommande) {
      setErreur(erreurCommande.message);
      setEnCours(false);
      return;
    }

    // Étape 2 : enregistrer les plats de la commande
    const lignesCommande = lignes.map((l) => ({
      commande_id: commande.id,
      plat_id: l.plat.id,
      quantite: l.quantite,
      prix_unitaire: l.plat.prix,
    }));

    await supabase.from("commande_plats").insert(lignesCommande);

    // Étape 3 : le paiement réel (agrégateur mobile money) se branchera ici,
    // côté backend Render, une fois cette partie développée

    viderPanier();
    localStorage.removeItem("dily-resto-livraison");
    navigate(`/suivi/${commande.id}`);
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Retour
      </button>
      <h1>Paiement</h1>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12 }}>
        <p style={{ fontWeight: 700, fontSize: 18 }}>Total à payer : {totalFinal} FCFA</p>
        <p style={{ fontSize: 13, color: "#666" }}>
          Livraison chez : {livraisonInfo.lieu}
        </p>
      </div>

      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: 14, color: "#666" }}>
          Moyen de paiement : Orange Money / MTN Money / Wave
        </p>
        {/* L'intégration réelle de l'agrégateur viendra ici */}
      </div>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}

      <button
        onClick={payer}
        disabled={enCours}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          background: "#2E6F4E",
          color: "white",
          fontWeight: 600,
          marginTop: 16,
        }}
      >
        {enCours ? "Traitement..." : `Payer ${totalFinal} FCFA`}
      </button>
    </div>
  );
}
