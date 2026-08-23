import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Panier() {
  const { lignes, changerQuantite, retirerDuPanier, total } = useCart();
  const navigate = useNavigate();

  if (lignes.length === 0) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
        <h1>Panier</h1>
        <p>Ton panier est vide.</p>
        <button onClick={() => navigate("/")}>Voir les plats</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>
        ← Retour
      </button>
      <h1>Ton panier</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {lignes.map(({ plat, quantite }) => (
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
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
                {plat.prix} FCFA
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button onClick={() => changerQuantite(plat.id, quantite - 1)}>-</button>
                <span>{quantite}</span>
                <button onClick={() => changerQuantite(plat.id, quantite + 1)}>+</button>
              </div>
            </div>
            <button onClick={() => retirerDuPanier(plat.id)} style={{ color: "red" }}>
              Retirer
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, borderTop: "1px solid #eee", paddingTop: 12 }}>
        <p style={{ fontWeight: 700, fontSize: 18 }}>Total : {total} FCFA</p>
        <button
          onClick={() => navigate("/livraison")}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#2E6F4E",
            color: "white",
            fontWeight: 600,
            marginTop: 8,
          }}
        >
          Continuer vers la livraison
        </button>
      </div>
    </div>
  );
}
