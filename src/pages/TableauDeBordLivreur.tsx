import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Livreur, Commande } from "../types/database";

export default function TableauDeBordLivreur() {
  const [livreur, setLivreur] = useState<Livreur | null>(null);
  const [missions, setMissions] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setChargement(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErreur("Tu dois être connecté en tant que livreur.");
      setChargement(false);
      return;
    }

    const { data: livreurData, error: erreurLivreur } = await supabase
      .from("livreurs")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (erreurLivreur || !livreurData) {
      setErreur("Profil livreur introuvable.");
      setChargement(false);
      return;
    }

    setLivreur(livreurData as Livreur);

    // Missions disponibles dans sa zone (pas encore assignées) + ses missions en cours
    const { data: missionsData } = await supabase
      .from("commandes")
      .select("*")
      .or(`livreur_id.eq.${livreurData.id},and(livreur_id.is.null,statut.eq.confirmee)`)
      .order("created_at", { ascending: false });

    setMissions((missionsData as Commande[]) || []);
    setChargement(false);
  }

  async function changerStatut(nouveauStatut: "disponible" | "hors_ligne") {
    if (!livreur) return;
    await supabase
      .from("livreurs")
      .update({ statut: nouveauStatut })
      .eq("id", livreur.id);
    chargerDonnees();
  }

  async function accepterMission(commandeId: string) {
    if (!livreur) return;
    await supabase
      .from("commandes")
      .update({ livreur_id: livreur.id, statut: "en_livraison" })
      .eq("id", commandeId);
    chargerDonnees();
  }

  async function marquerLivree(commandeId: string) {
    await supabase
      .from("commandes")
      .update({ statut: "livree" })
      .eq("id", commandeId);
    chargerDonnees();
  }

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>{erreur}</p>;
  if (!livreur) return null;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Bonjour {livreur.nom}</h1>

      <div
        style={{
          padding: 12,
          borderRadius: 12,
          background: livreur.statut === "disponible" ? "#e6f4ea" : "#f0f0f0",
          marginBottom: 16,
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>
          Statut : {livreur.statut === "disponible" ? "🟢 Disponible" : "⚪ Hors ligne"}
        </p>
        <button
          onClick={() =>
            changerStatut(livreur.statut === "disponible" ? "hors_ligne" : "disponible")
          }
          style={{
            marginTop: 8,
            padding: "8px 14px",
            borderRadius: 8,
            border: "none",
            background: "#2E6F4E",
            color: "white",
          }}
        >
          {livreur.statut === "disponible" ? "Passer hors ligne" : "Passer disponible"}
        </button>
      </div>

      <h2 style={{ fontSize: 16 }}>Missions</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {missions.map((commande) => (
          <div
            key={commande.id}
            style={{
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>
              Commande #{commande.id.slice(0, 8)}
            </p>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
              Statut : {commande.statut} · {commande.montant_total} FCFA
            </p>

            {!commande.livreur_id && (
              <button onClick={() => accepterMission(commande.id)}>
                Accepter cette mission
              </button>
            )}

            {commande.livreur_id === livreur.id && commande.statut === "en_livraison" && (
              <button onClick={() => marquerLivree(commande.id)}>
                Marquer comme livrée
              </button>
            )}
          </div>
        ))}
        {missions.length === 0 && <p>Aucune mission pour le moment.</p>}
      </div>
    </div>
  );
}
