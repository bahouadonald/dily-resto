import { useNavigate } from "react-router-dom";

export default function InscriptionConfirmee() {
  const navigate = useNavigate();
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, textAlign: "center" }}>
      <h1>Inscription reçue !</h1>
      <p>
        Ton restaurant est en cours de vérification par notre équipe. Tu
        pourras gérer ton menu une fois ton compte validé.
      </p>
      <button onClick={() => navigate("/")} style={{ marginTop: 16 }}>
        Retour à l'accueil
      </button>
    </div>
  );
}
