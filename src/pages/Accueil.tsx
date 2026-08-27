import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import platCouverture from "../plat-couverture.png";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh" }}>
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
          <img
            src={logo}
            alt="Dily resto"
            style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }}
          />
          <span style={{ fontWeight: 700, fontSize: 18 }}>Dily resto</span>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => navigate("/restaurant-inscription")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--dily-bordure)", background: "white", fontSize: 13, fontWeight: 600 }}
          >
            Espace resto
          </button>
          <button
            onClick={() => navigate("/livreur-inscription")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid var(--dily-bordure)", background: "white", fontSize: 13, fontWeight: 600 }}
          >
            Espace livreur
          </button>
          <button
            onClick={() => navigate("/connexion")}
            style={{ padding: "8px 12px", borderRadius: 8, border: "none", background: "var(--dily-vert)", color: "white", fontSize: 13, fontWeight: 600 }}
          >
            Connexion
          </button>
        </div>
      </header>

      {/* Hero en deux colonnes : texte + photo */}
      <section
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 24,
          padding: "40px 20px",
          background: "linear-gradient(180deg, #E1F5EE 0%, var(--dily-fond) 100%)",
        }}
      >
        <div style={{ flex: "1 1 280px", minWidth: 260 }}>
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
        </div>

        <div style={{ flex: "1 1 260px", minWidth: 220, display: "flex", justifyContent: "center" }}>
          <img
            src={platCouverture}
            alt="Plat africain Dily resto"
            style={{
              width: "100%",
              maxWidth: 320,
              borderRadius: 20,
              objectFit: "cover",
              boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
            }}
          />
        </div>
      </section>

      {/* Bloc arguments */}
      <section style={{ padding: "24px 20px", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 14, background: "#EAF7F0", border: "1px solid #CDE9DB" }}>
            <div style={{ fontSize: 24 }}>🎁</div>
            <p style={{ margin: "6px 0 0", fontWeight: 700 }}>5 premières livraisons</p>
            <p style={{ margin: 0, color: "var(--dily-vert)", fontWeight: 700 }}>GRATUITES !</p>
          </div>
          <div style={{ flex: "1 1 200px", padding: 16, borderRadius: 14, background: "#FDF3E7", border: "1px solid #F3DDB8" }}>
            <div style={{ fontSize: 24 }}>🛵</div>
            <p style={{ margin: "6px 0 0" }}>Frais de livraison</p>
            <p style={{ margin: 0, fontWeight: 700 }}>
              jusqu'à <span style={{ color: "var(--dily-amber)" }}>300 FCFA</span> maximum
            </p>
          </div>
        </div>
      </section>

      {/* Bloc explicatif */}
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
