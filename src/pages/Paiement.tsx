import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";

const TAUX_COMMISSION = 0.30; // 30% sur le prix fixé par le restaurant

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
  const commissionMontant = Math.round(total * TAUX_COMMISSION);

  async function payer() {
    setEnCours(true);
    setErreur(null);

    const restaurantId = lignes[0]?.plat.restaurant_id;

    const { data: commande, error: erreurCommande } = await supabase
      .from("commandes")
      .insert({
        restaurant_id: restaurantId,
        montant_total: total,
        frais_livraison: fraisLivraison,
        commission_montant: commissionMontant,
        statut: "confirmee",
      })
      .select()
      .single();

    if (erreurCommande) {
      setErreur(erreurCommande.message);
      setEnCours(false);
      return;
    }

    const lignesCommande = lignes.map((l) => ({
      commande_id: commande.id,
      plat_id: l.plat.id,
      quantite: l.quantite,
      prix_unitaire: l.plat.prix,
    }));

    await supabase.from("commande_plats").insert(lignesCommande);

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
