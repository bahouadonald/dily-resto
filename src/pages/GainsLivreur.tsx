import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Livreur } from "../types/database";

interface CommandeLivree {
  id: string;
  frais_livraison: number;
  created_at: string;
}

export default function GainsLivreur() {
  const [livreur, setLivreur] = useState<Livreur | null>(null);
  const [commandes, setCommandes] = useState<CommandeLivree[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerGains();
  }, []);

  async function chargerGains() {
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

    const { data: commandesData } = await supabase
      .from("commandes")
      .select("id, frais_livraison, created_at")
      .eq("livreur_id", livreurData.id)
      .eq("statut", "livree")
      .order("created_at", { ascending: false });

    setCommandes((commandesData as CommandeLivree[]) || []);
    setChargement(false);
  }

  if (chargement) return <p>Chargement...</p>;
  if (!livreur) return <p>Profil livreur introuvable.</p>;

  const aujourdHui = new Date().toDateString();
  const commandesAujourdhui = commandes.filter(
    (c) => new Date(c.created_at).toDateString() === aujourdHui
  );
  const gainsAujourdhui = commandesAujourdhui.reduce((s, c) => s + c.frais_livraison, 0);
  const gainsTotal = commandes.reduce((s, c) => s + c.frais_livraison, 0);

  // Gains du mois en cours
  const moisActuel = new Date().getMonth();
  const anneeActuelle = new Date().getFullYear();
  const commandesDuMois = commandes.filter((c) => {
    const d = new Date(c.created_at);
    return d.getMonth() === moisActuel && d.getFullYear() === anneeActuelle;
  });
  const gainsDuMois = commandesDuMois.reduce((s, c) => s + c.frais_livraison, 0);

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>Mes gains</h1>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <div style={{ flex: 1, padding: 14, borderRadius: 12, background: "#EAF7F0", border: "1px solid #CDE9DB" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Aujourd'hui</p>
          <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700, color: "var(--dily-vert)" }}>
            {gainsAujourdhui} FCFA
          </p>
          <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{commandesAujourdhui.length} livraisons</p>
        </div>
        <div style={{ flex: 1, padding: 14, borderRadius: 12, background: "#FDF3E7", border: "1px solid #F3DDB8" }}>
          <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Ce mois-ci</p>
          <p style={{ margin: "4px 0 0", fontSize: 20, fontWeight: 700 }}>{gainsDuMois} FCFA</p>
          <p style={{ margin: 0, fontSize: 11, color: "#888" }}>{commandesDuMois.length} livraisons</p>
        </div>
      </div>

      <p style={{ fontSize: 13, color: "#666" }}>
        Total cumulé : <strong>{gainsTotal} FCFA</strong> sur {commandes.length} livraisons
      </p>

      <h2 style={{ fontSize: 16, marginTop: 20 }}>Historique</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {commandes.map((c) => (
          <div
            key={c.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 10,
            }}
          >
            <span style={{ fontSize: 13 }}>
              {new Date(c.created_at).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span style={{ fontWeight: 700, color: "var(--dily-vert)" }}>+{c.frais_livraison} FCFA</span>
          </div>
        ))}
        {commandes.length === 0 && <p>Aucune livraison effectuée pour le moment.</p>}
      </div>
    </div>
  );
}
