import { useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";
import type { Livreur } from "../types/database";

interface Etape {
  id: string;
  tournee_id: string;
  commande_id: string;
  type_etape: "recuperation" | "livraison";
  ordre: number;
  adresse_libelle: string | null;
  statut: "a_faire" | "fait";
}

interface Tournee {
  id: string;
  statut: string;
  nombre_plats: number;
}

export default function FeuilleDeRoute() {
  const [livreur, setLivreur] = useState<Livreur | null>(null);
  const [tournee, setTournee] = useState<Tournee | null>(null);
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [chargement, setChargement] = useState(true);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    chargerDonnees();
    const intervalle = setInterval(chargerDonnees, 15000);
    return () => clearInterval(intervalle);
  }, []);

  // Démarre/arrête le suivi GPS selon que le livreur est en tournée ou non
  useEffect(() => {
    if (tournee?.statut === "en_cours") {
      demarrerSuiviGPS();
    } else {
      arreterSuiviGPS();
    }
    return () => arreterSuiviGPS();
  }, [tournee?.statut]);

  function demarrerSuiviGPS() {
    if (watchIdRef.current !== null) return; // déjà actif
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        if (!livreur) return;
        await supabase
          .from("livreurs")
          .update({
            latitude_actuelle: position.coords.latitude,
            longitude_actuelle: position.coords.longitude,
            derniere_maj_position: new Date().toISOString(),
          })
          .eq("id", livreur.id);
      },
      (erreur) => console.error("Erreur GPS :", erreur),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  }

  function arreterSuiviGPS() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }

  async function chargerDonnees() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setChargement(false);
      return;
    }

    const { data: livreurData } = await supabase
      .from("livreurs")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (!livreurData) {
      setChargement(false);
      return;
    }

    setLivreur(livreurData as Livreur);

    const { data: tourneeData } = await supabase
      .from("tournees")
      .select("*")
      .eq("livreur_id", livreurData.id)
      .in("statut", ["planifiee", "en_cours"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tourneeData) {
      setTournee(tourneeData as Tournee);

      const { data: etapesData } = await supabase
        .from("etapes_tournee")
        .select("*")
        .eq("tournee_id", tourneeData.id)
        .order("ordre", { ascending: true });

      setEtapes((etapesData as Etape[]) || []);
    } else {
      setTournee(null);
      setEtapes([]);
    }

    setChargement(false);
  }

  async function demarrerTournee() {
    if (!tournee) return;
    await supabase
      .from("tournees")
      .update({ statut: "en_cours", heure_debut_reelle: new Date().toISOString() })
      .eq("id", tournee.id);
    chargerDonnees();
  }

  async function marquerEtapeFaite(etape: Etape) {
    await supabase
      .from("etapes_tournee")
      .update({ statut: "fait", heure_reelle: new Date().toISOString() })
      .eq("id", etape.id);

    if (etape.type_etape === "livraison") {
      await supabase
        .from("commandes")
        .update({ statut: "livree" })
        .eq("id", etape.commande_id);
    }

    chargerDonnees();
  }

  async function terminerTournee() {
    if (!tournee) return;
    await supabase
      .from("tournees")
      .update({ statut: "terminee", heure_fin_reelle: new Date().toISOString() })
      .eq("id", tournee.id);
    arreterSuiviGPS();
    chargerDonnees();
  }

  if (chargement) return <p>Chargement...</p>;
  if (!livreur) return <p>Profil livreur introuvable.</p>;

  if (!tournee) {
    return (
      <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
        <h1>Aucune tournée pour l'instant</h1>
        <p>
          Reste disponible — une tournée te sera assignée dès qu'elle est
          planifiée.
        </p>
      </div>
    );
  }

  const toutesLesEtapesFaites = etapes.every((e) => e.statut === "fait");

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Ta tournée</h1>
      <p style={{ color: "#666" }}>
        {tournee.nombre_plats} plats · Statut : {tournee.statut}
      </p>
      {tournee.statut === "en_cours" && (
        <p style={{ fontSize: 12, color: "#2E6F4E" }}>📍 Position partagée en direct</p>
      )}

      {tournee.statut === "planifiee" && (
        <button
          onClick={demarrerTournee}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            border: "none",
            background: "#2E6F4E",
            color: "white",
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          Démarrer la tournée
        </button>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {etapes.map((etape, index) => (
          <div
            key={etape.id}
            style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
              opacity: etape.statut === "fait" ? 0.5 : 1,
              background: etape.type_etape === "recuperation" ? "#eaf3ee" : "#fff",
            }}
          >
            <p style={{ margin: 0, fontSize: 12, color: "#666" }}>
              Étape {index + 1} · {etape.type_etape === "recuperation" ? "🍽 Récupération" : "📍 Livraison"}
            </p>
            <p style={{ margin: "4px 0", fontWeight: 600 }}>
              {etape.adresse_libelle || "Adresse non renseignée"}
            </p>
            {etape.statut === "a_faire" && tournee.statut === "en_cours" && (
              <button onClick={() => marquerEtapeFaite(etape)}>
                Marquer fait
              </button>
            )}
            {etape.statut === "fait" && <p style={{ color: "green" }}>✓ Fait</p>}
          </div>
        ))}
      </div>

      {toutesLesEtapesFaites && tournee.statut === "en_cours" && (
        <button
          onClick={terminerTournee}
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
          Terminer la tournée
        </button>
      )}
    </div>
  );
}
