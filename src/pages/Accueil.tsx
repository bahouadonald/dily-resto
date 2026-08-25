import { useNavigate } from "react-router-dom";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Bandeau du haut avec les 3 espaces */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "14px 20px",
          background: "var(--dily-blanc)",
          borderBottom: "1px solid var(--dily-bordure)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: "var(--dily-vert)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            D
          </div>
          <span style={{ fontWeight: 700, fontSize: 18 }}>Dily resto</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => navigate("/restaurant-inscription")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--dily-bordure)",
              background: "white",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Espace resto
          </button>
          <button
            onClick={() => navigate("/livreur-inscription")}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--dily-bordure)",
              background: "white",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Espace livreur
          </button>
        </div>
      </header>

      {/* Section principale — mise en avant du travailleur */}
      <section
        style={{
          padding: "40px 20px",
          textAlign: "center",
          background: "linear-gradient(180deg, #E1F5EE 0%, var(--dily-fond) 100%)",
        }}
      >
        <h1 style={{ fontSize: 26, margin: "0 0 8px", color: "var(--dily-vert-fonce)" }}>
          Ton déjeuner, livré au bureau
        </h1>
        <p style={{ fontSize: 15, color: "var(--dily-texte-clair)", margin: "0 0 24px" }}>
          De vrais plats de cuisine africaine, choisis en 1 minute, livrés
          chaque midi sur ton lieu de travail.
        </p>

        <button
          onClick={() => navigate("/commander")}
          style={{
            padding: "14px 32px",
            borderRadius: 12,
            border: "none",
            background: "var(--dily-vert)",
            color: "white",
            fontSize: 16,
            fontWeight: 700,
          }}
        >
          Commander mon plat →
        </button>
      </section>

      {/* Bloc explicatif rapide */}
      <section style={{ padding: "32px 20px", maxWidth: 420, margin: "0 auto" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22 }}>🍛</span>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Choisis ton plat</p>
              <p style={{ fontSize: 13, color: "var(--dily-texte-clair)", margin: "2px 0 0" }}>
                Parmi les restaurants certifiés de ta zone.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22 }}>⏱️</span>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Commande avant 11h30</p>
              <p style={{ fontSize: 13, color: "var(--dily-texte-clair)", margin: "2px 0 0" }}>
                Le service de livraison démarre juste après.
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{ fontSize: 22 }}>📍</span>
            <div>
              <p style={{ fontWeight: 700, margin: 0 }}>Livré à ton bureau</p>
              <p style={{ fontSize: 13, color: "var(--dily-texte-clair)", margin: "2px 0 0" }}>
                Suis ton livreur en direct sur la carte.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ textAlign: "center", padding: "20px", fontSize: 12, color: "var(--dily-texte-clair)" }}>
        Dily resto — un service Dilycash
      </footer>
    </div>
  );
}
