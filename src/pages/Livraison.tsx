import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Livraison() {
  const { total } = useCart();
  const navigate = useNavigate();
  const [lieu, setLieu] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [telephone, setTelephone] = useState("");

  const fraisLivraison = 500; // fixe pour l'instant, ajustable par zone plus tard

  function continuer() {
    if (!lieu || !telephone) return;
    // On stocke temporairement les infos de livraison pour l'étape paiement
    localStorage.setItem(
      "dily-resto-livraison",
      JSON.stringify({ lieu, entreprise, telephone, fraisLivraison })
    );
    navigate("/paiement");
  }

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
        <p>Livraison : {fraisLivraison} FCFA</p>
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
            background: !lieu || !telephone ? "#ccc" : "#2E6F4E",
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
