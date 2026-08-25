import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { supabase } from "../lib/supabase";

export default function SuiviCommande() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [statutCommande, setStatutCommande] = useState<string | null>(null);
  const [positionLivreur, setPositionLivreur] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!id) return;
    chargerSuivi();
    const intervalle = setInterval(chargerSuivi, 10000);
    return () => clearInterval(intervalle);
  }, [id]);

  async function chargerSuivi() {
    const { data: commande } = await supabase
      .from("commandes")
      .select("*, livreurs(latitude_actuelle, longitude_actuelle)")
      .eq("id", id)
      .single();

    if (commande) {
      setStatutCommande(commande.statut);
      if (commande.livreurs?.latitude_actuelle) {
        setPositionLivreur({
          lat: commande.livreurs.latitude_actuelle,
          lng: commande.livreurs.longitude_actuelle,
        });
      }
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Ta commande</h1>
      <p>Numéro : {id}</p>
      <p>Statut : {statutCommande || "..."}</p>

      {positionLivreur ? (
        <div style={{ height: 300, borderRadius: 12, overflow: "hidden", marginTop: 12 }}>
          <MapContainer
            center={[positionLivreur.lat, positionLivreur.lng]}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[positionLivreur.lat, positionLivreur.lng]}>
              <Popup>Ton livreur</Popup>
            </Marker>
          </MapContainer>
        </div>
      ) : (
        <p style={{ color: "#666", fontSize: 13 }}>
          Le suivi en direct apparaîtra dès que ton livreur sera en route.
        </p>
      )}

      <button onClick={() => navigate("/")} style={{ marginTop: 16 }}>
        Retour à l'accueil
      </button>
    </div>
  );
}
