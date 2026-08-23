import { useParams, useNavigate } from "react-router-dom";

export default function SuiviCommande() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h1>Commande confirmée !</h1>
      <p>Numéro de commande : {id}</p>
      <p>Ton restaurant a reçu la commande et va la préparer.</p>
      <p style={{ color: "#666", fontSize: 13 }}>
        (Le suivi en temps réel du livreur sera ajouté ici)
      </p>
      <button onClick={() => navigate("/")} style={{ marginTop: 16 }}>
        Retour à l'accueil
      </button>
    </div>
  );
}
