import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { telephoneVersEmail } from "../lib/authPhone";

interface Zone {
  id: string;
  nom: string;
}

export default function InscriptionLivreur() {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [moyenTransport, setMoyenTransport] = useState("moto");
  const [zoneId, setZoneId] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("zones").select("id, nom").then(({ data }) => setZones(data || []));
  }, []);

  async function sInscrire() {
    if (!telephone || !motDePasse || !nom || !zoneId) return;
    setEnCours(true);
    setErreur(null);

    const email = telephoneVersEmail(telephone);

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
      zone_id: zoneId,
      statut: "hors_ligne",
    });

    if (erreurLivreur) {
      setErreur(erreurLivreur.message);
      setEnCours(false);
      return;
    }

    setEnCours(false);
    navigate("/livreur/tournee");
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
          Ta zone
          <select
            value={zoneId}
            onChange={(e) => setZoneId(e.target.value)}
            style={{ width: "100%", padding: 10, marginTop: 4 }}
          >
            <option value="">Choisis ta zone</option>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nom}
              </option>
            ))}
          </select>
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
          Téléphone (sert d'identifiant de connexion)
          <input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
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
        onClick={sInscrire}
        disabled={enCours || !telephone || !motDePasse || !nom || !zoneId}
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
        {enCours ? "Inscription..." : "S'inscrire"}
      </button>
    </div>
  );
}
