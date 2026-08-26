import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Zone {
  id: string;
  nom: string;
}

export default function InscriptionTravailleur() {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [entreprise, setEntreprise] = useState("");
  const [lieuTravail, setLieuTravail] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("zones").select("id, nom").then(({ data }) => setZones(data || []));
  }, []);

  async function sInscrire() {
    if (!email || !motDePasse || !nom || !zoneId) return;
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

    const { error: erreurTravailleur } = await supabase.from("travailleurs").insert({
      auth_user_id: authData.user.id,
      nom,
      telephone,
      entreprise,
      lieu_travail: lieuTravail,
      zone_id: zoneId,
    });

    if (erreurTravailleur) {
      setErreur(erreurTravailleur.message);
      setEnCours(false);
      return;
    }

    setEnCours(false);
    navigate("/commander");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Créer mon compte</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
        <label>
          Nom complet
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>

        <label>
          Téléphone
          <input type="tel" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>

        <label>
          Ta zone
          <select value={zoneId} onChange={(e) => setZoneId(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }}>
            <option value="">Choisis ta zone</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>{z.nom}</option>
            ))}
          </select>
        </label>

        <label>
          Lieu de travail (adresse)
          <input type="text" value={lieuTravail} onChange={(e) => setLieuTravail(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>

        <label>
          Entreprise (optionnel)
          <input type="text" value={entreprise} onChange={(e) => setEntreprise(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>

        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>

        <label>
          Mot de passe
          <input type="password" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} style={{ width: "100%", padding: 10, marginTop: 4 }} />
        </label>
      </div>

      {erreur && <p style={{ color: "red" }}>{erreur}</p>}

      <button
        onClick={sInscrire}
        disabled={enCours || !email || !motDePasse || !nom || !zoneId}
        style={{ width: "100%", padding: 12, borderRadius: 8, border: "none", background: "var(--dily-vert)", color: "white", fontWeight: 600, marginTop: 16 }}
      >
        {enCours ? "Création..." : "Créer mon compte"}
      </button>

      <p style={{ textAlign: "center", marginTop: 16, fontSize: 14 }}>
        Déjà inscrit ? <a href="/connexion">Se connecter</a>
      </p>
    </div>
  );
}
