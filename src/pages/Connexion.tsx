import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { telephoneVersEmail } from "../lib/authPhone";

export default function Connexion() {
  const navigate = useNavigate();
  const [identifiant, setIdentifiant] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  async function seConnecter() {
    setEnCours(true);
    setErreur(null);

    const email = identifiant.includes("@") ? identifiant : telephoneVersEmail(identifiant);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: motDePasse,
    });

    if (error || !data.user) {
      setErreur("Identifiant ou mot de passe incorrect.");
      setEnCours(false);
      return;
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();

    if (restaurant) {
      navigate("/restaurant/commandes");
      return;
    }

    const { data: livreur } = await supabase
      .from("livreurs")
      .select("id")
      .eq("auth_user_id", data.user.id)
      .maybeSingle();

    if (livreur) {
      navigate("/livreur/tournee");
      return;
    }

    navigate("/commander");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Connexion</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <label>
          Téléphone ou email
          <input
            type="text"
            value={identifiant}
            onChange={(e) => setIdentifiant(e.target.value)}
            placeholder="07 00 00 00 00"
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
        onClick={seConnecter}
        disabled={enCours || !identifiant || !motDePasse}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "none",
          background: "var(--dily-vert)",
          color: "white",
          fontWeight: 600,
          marginTop: 16,
        }}
      >
        {enCours ? "Connexion..." : "Se connecter"}
      </button>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 13 }}>
        Pas encore de compte ?
        <br />
        <a href="/travailleur-inscription">Je suis travailleur</a> ·{" "}
        <a href="/restaurant-inscription">Je suis restaurant</a> ·{" "}
        <a href="/livreur-inscription">Je suis livreur</a>
      </p>
    </div>
  );
}
