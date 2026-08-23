import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Plat, Restaurant } from "../types/database";

export default function GestionMenu() {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [plats, setPlats] = useState<Plat[]>([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  // Formulaire d'ajout
  const [nom, setNom] = useState("");
  const [prix, setPrix] = useState("");
  const [categorie, setCategorie] = useState("");
  const [ajoutEnCours, setAjoutEnCours] = useState(false);

  useEffect(() => {
    chargerDonnees();
  }, []);

  async function chargerDonnees() {
    setChargement(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setErreur("Tu dois être connecté en tant que restaurant.");
      setChargement(false);
      return;
    }

    const { data: restaurantData, error: erreurRestaurant } = await supabase
      .from("restaurants")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (erreurRestaurant || !restaurantData) {
      setErreur("Profil restaurant introuvable.");
      setChargement(false);
      return;
    }

    setRestaurant(restaurantData as Restaurant);

    const { data: platsData } = await supabase
      .from("plats")
      .select("*")
      .eq("restaurant_id", restaurantData.id)
      .order("created_at", { ascending: false });

    setPlats((platsData as Plat[]) || []);
    setChargement(false);
  }

  async function ajouterPlat() {
    if (!restaurant || !nom || !prix) return;
    setAjoutEnCours(true);

    const { error } = await supabase.from("plats").insert({
      restaurant_id: restaurant.id,
      nom,
      prix: parseFloat(prix),
      categorie,
      disponible: true,
    });

    if (!error) {
      setNom("");
      setPrix("");
      setCategorie("");
      chargerDonnees();
    }
    setAjoutEnCours(false);
  }

  async function basculerDisponibilite(plat: Plat) {
    await supabase
      .from("plats")
      .update({ disponible: !plat.disponible })
      .eq("id", plat.id);
    chargerDonnees();
  }

  async function supprimerPlat(platId: string) {
    await supabase.from("plats").delete().eq("id", platId);
    chargerDonnees();
  }

  if (chargement) return <p>Chargement...</p>;
  if (erreur) return <p>{erreur}</p>;
  if (!restaurant) return null;

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16 }}>
      <h1>{restaurant.nom} — Mon menu</h1>
      <p style={{ fontSize: 13, color: "#666" }}>
        Statut du compte : {restaurant.statut}
      </p>

      <div style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, marginTop: 16 }}>
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Ajouter un plat</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            type="text"
            placeholder="Nom du plat"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="number"
            placeholder="Prix (FCFA)"
            value={prix}
            onChange={(e) => setPrix(e.target.value)}
            style={{ padding: 8 }}
          />
          <input
            type="text"
            placeholder="Catégorie (ex: Riz, Sauces)"
            value={categorie}
            onChange={(e) => setCategorie(e.target.value)}
            style={{ padding: 8 }}
          />
          <button
            onClick={ajouterPlat}
            disabled={ajoutEnCours || !nom || !prix}
            style={{
              padding: 10,
              borderRadius: 8,
              border: "none",
              background: "#2E6F4E",
              color: "white",
            }}
          >
            {ajoutEnCours ? "Ajout..." : "Ajouter le plat"}
          </button>
        </div>
      </div>

      <h2 style={{ marginTop: 24, fontSize: 16 }}>Mes plats</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plats.map((plat) => (
          <div
            key={plat.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              border: "1px solid #eee",
              borderRadius: 12,
              opacity: plat.disponible ? 1 : 0.5,
            }}
          >
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>{plat.nom}</p>
              <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
                {plat.prix} FCFA {plat.categorie && `· ${plat.categorie}`}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => basculerDisponibilite(plat)}>
                {plat.disponible ? "Masquer" : "Réactiver"}
              </button>
              <button onClick={() => supprimerPlat(plat.id)} style={{ color: "red" }}>
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {plats.length === 0 && <p>Aucun plat ajouté pour l'instant.</p>}
      </div>
    </div>
  );
}
