import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Restaurant, Livreur, Commande } from "../types/database";

// À remplacer par ton email admin réel
const EMAILS_ADMIN = ["admin@dilyresto.com"];

export default function AdminDashboard() {
  const [autorise, setAutorise] = useState<boolean | null>(null);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    verifierAcces();
  }, []);

  async function verifierAcces() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !EMAILS_ADMIN.includes(user.email || "")) {
      setAutorise(false);
      return;
    }
    setAutorise(true);
    chargerDonnees();
  }

  async function chargerDonnees() {
    setChargement(true);

    const { data: restaurantsData } = await supabase
      .from("restaurants")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: livreursData } = await supabase
      .from("livreurs")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: commandesData } = await supabase
      .from("commandes")
      .select("*")
      .order("created_at", { ascending: false });

    setRestaurants((restaurantsData as Restaurant[]) || []);
    setLivreurs((livreursData as Livreur[]) || []);
    setCommandes((commandesData as Commande[]) || []);
    setChargement(false);
  }

  async function validerRestaurant(id: string) {
    await supabase.from("restaurants").update({ statut: "actif" }).eq("id", id);
    chargerDonnees();
  }

  async function suspendreRestaurant(id: string) {
    await supabase.from("restaurants").update({ statut: "suspendu" }).eq("id", id);
    chargerDonnees();
  }

  if (autorise === null) return <p>Vérification...</p>;
  if (autorise === false) return <p>Accès réservé à l'administration.</p>;
  if (chargement) return <p>Chargement...</p>;

  const commissionTotale = commandes.reduce((s, c) => s + c.commission_montant, 0);
  const restaurantsEnAttente = restaurants.filter((r) => r.statut === "en_attente");
  const restaurantsActifs = restaurants.filter((r) => r.statut === "actif");

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: 16 }}>
      <h1>Back-office Dily resto</h1>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
        <div style={{ flex: 1, minWidth: 140, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Restaurants actifs</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{restaurantsActifs.length}</p>
        </div>
        <div style={{ flex: 1, minWidth: 140, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Livreurs inscrits</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{livreurs.length}</p>
        </div>
        <div style={{ flex: 1, minWidth: 140, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Commandes totales</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{commandes.length}</p>
        </div>
        <div style={{ flex: 1, minWidth: 140, padding: 12, border: "1px solid #eee", borderRadius: 12 }}>
          <p style={{ margin: 0, fontSize: 13, color: "#666" }}>Commissions perçues</p>
          <p style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>{commissionTotale} FCFA</p>
        </div>
      </div>

      <h2 style={{ fontSize: 18 }}>Restaurants en attente de validation</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {restaurantsEnAttente.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
            }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>{r.nom}</p>
            <button
              onClick={() => validerRestaurant(r.id)}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "none",
                background: "#2E6F4E",
                color: "white",
              }}
            >
              Valider
            </button>
          </div>
        ))}
        {restaurantsEnAttente.length === 0 && <p>Aucune inscription en attente.</p>}
      </div>

      <h2 style={{ fontSize: 18 }}>Tous les restaurants</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {restaurants.map((r) => (
          <div
            key={r.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
            }}
          >
            <div>
              <p style={{ margin: 0, fontWeight: 600 }}>{r.nom}</p>
              <p style={{ margin: "4px 0", fontSize: 13, color: "#666" }}>
                Statut : {r.statut} · Commission : {(r.commission_taux * 100).toFixed(0)}%
              </p>
            </div>
            {r.statut === "actif" && (
              <button onClick={() => suspendreRestaurant(r.id)} style={{ color: "red" }}>
                Suspendre
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
