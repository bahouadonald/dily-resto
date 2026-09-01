import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { telephoneVersEmail } from "../lib/authPhone";

interface Zone {
  id: string;
  nom: string;
}

export default function InscriptionRestaurant() {
  const navigate = useNavigate();
  const [zones, setZones] = useState<Zone[]>([]);
  const [telephone, setTelephone] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [zoneId, setZoneId] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsEnCours, setGpsEnCours] = useState(false);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("zones").select("id, nom").then(({ data }) => setZones(data || []));
  }, []);

  function capterPosition() {
    if (!navigator.geolocation) {
      setErreur("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setGpsEnCours(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        setGpsEnCours(false);
      },
      () => {
        setErreur("Impossible de récupérer ta position. Vérifie que la localisation est autorisée.");
        setGpsEnCours(false);
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

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

    const { error: erreurRestaurant } = await supabase.from("restaurants").insert({
      auth_user_id: authData.user.id,
      nom,
      description,
      telephone,
      zone_id: zoneId,
      latitude,
      longitude,
      statut: "en_attente",
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

        <div>
          <button
            type="button"
            onClick={capterPosition}
            disabled={gpsEnCours}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid var(--dily-bordure)",
              background: latitude ? "#EAF7F0" : "white",
              fontWeight: 600,
            }}
          >
            {gpsEnCours
              ? "Localisation en cours..."
              : latitude
              ? "✓ Position enregistrée"
              : "📍 Utiliser ma position GPS actuelle"}
          </button>
          <p style={{ fontSize: 12, color: "#888", margin: "4px 0 0" }}>
            À faire depuis l'emplacement réel du restaurant.
          </p>
        </div>

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
