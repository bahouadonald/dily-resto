import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function InscriptionLivreur() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [moyenTransport, setMoyenTransport] = useState("moto");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function sInscrire() {
    if (!email || !motDePasse || !nom || !telephone) return;
    setEnCours(true);
    setErreur(null);

    const { data: authData, error: erreurAuth } = await supabase.auth.signUp({
      email,
      password: motDePasse,
    });

    if (erreurAuth || !authData.user) {
      setErreur(erreurAuth?.message || "Erreur lors de la création du compte.");
      setEnCours(false);
      return;
    }

    const { error: erreurLivreur } = await supabase.from("livreurs").insert({
      auth_user_id: authData.user.id,
      nom,
      telephone,
      moyen_transport: moyenTransport,
      statut: "hors_ligne",
    });

    if (erreurLivreur) {
      setErreur(erreurLivreur.message);
      setEnCours(false);
      return;
    }

    setEnCours(false);
    navigate("/livreur/tableau-de-bord");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Devenir livreur</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <label>
          Nom complet
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Téléphone
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          />
        </label>

        <label>
          Moyen de transport
          <select
            value={moyenTransport}
            onChange={(e) => setMoyenTransport(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          >
            <option value="moto">Moto</option>
            <option value="velo">Vélo</option>
            <option value="pied">À pied</option>
          </select>
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
        disabled={enCours || !email || !motDePasse || !nom || !telephone}
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
