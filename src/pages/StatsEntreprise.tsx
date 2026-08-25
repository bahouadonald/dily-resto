import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

interface StatEntreprise {
  entreprise_id: string;
  nom: string;
  nombre_travailleurs: number;
  nombre_commandes: number;
}

export default function StatsEntreprise() {
  const [stats, setStats] = useState<StatEntreprise[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    chargerStats();
  }, []);

  async function chargerStats() {
    const { data: entreprises } = await supabase.from("entreprises").select("*");
    if (!entreprises) {
      setChargement(false);
      return;
    }

    const resultats: StatEntreprise[] = [];

    for (const entreprise of entreprises) {
      const { data: travailleurs } = await supabase
        .from("travailleurs")
        .select("id")
        .eq("entreprise_id", entreprise.id);

      const idsTravailleurs = (travailleurs || []).map((t) => t.id);

      let nombreCommandes = 0;
      if (idsTravailleurs.length > 0) {
        const { count } = await supabase
          .from("commandes")
          .select("*", { count: "exact", head: true })
          .in("travailleur_id", idsTravailleurs);
        nombreCommandes = count || 0;
      }

      resultats.push({
        entreprise_id: entreprise.id,
        nom: entreprise.nom,
        nombre_travailleurs: idsTravailleurs.length,
        nombre_commandes: nombreCommandes,
      });
    }

    setStats(resultats.sort((a, b) => b.nombre_commandes - a.nombre_commandes));
    setChargement(false);
  }

  if (chargement) return <p>Chargement...</p>;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: 16 }}>
      <h1>Volume par entreprise</h1>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {stats.map((s) => (
          <div
            key={s.entreprise_id}
            style={{ padding: 10, border: "1px solid #eee", borderRadius: 12 }}
          >
            <p style={{ margin: 0, fontWeight: 600 }}>{s.nom}</p>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>
              {s.nombre_travailleurs} travailleurs · {s.nombre_commandes} commandes
            </p>
          </div>
        ))}
        {stats.length === 0 && <p>Aucune entreprise enregistrée.</p>}
      </div>
      <p style={{ fontSize: 12, color: "#999", marginTop: 16 }}>
        À toi de décider, selon ce volume, quelles entreprises méritent un
        buffet gratuit mensuel.
      </p>
    </div>
  );
}
