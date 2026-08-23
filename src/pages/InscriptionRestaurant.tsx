import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function InscriptionRestaurant() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function sInscrire() {
    if (!email || !motDePasse || !nom) return;
    setEnCours(true);
    setErreur(null);

    // Étape 1 : créer le compte d'authentification
    const { data: authData, error: erreurAuth } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });

    if (erreurAuth || !authData.user) {
      setErreur(erreurAuth?.message || "Erreur lors de la création du compte.");
      setEnCours(false);
      return;
    }

    // Étape 2 : créer la fiche restaurant, liée au compte
    const { error: erreurRestaurant } = await supabase.from("restaurants").insert({
      auth_user_id: authData.user.id,
      nom,
      description,
      statut: "en_attente", // validé ensuite par l'administration
    });

    if (erreurRestaurant) {
      setErreur(erreurRestaurant.message);
      setEnCours(false);
      return;
    }

    setEnCours(false);
    navigate("/restaurant/inscription-confirmee");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Inscrire mon restaurant</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <label>
          Nom du restaurant
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>
      </div>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}

      <button
        onClick={sInscrire}
        disabled={enCours || !email || !motDePasse || !nom}
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
        {enCours ? "Inscription..." : "S'inscrire"}
      </button>
    </div>
  );
}
