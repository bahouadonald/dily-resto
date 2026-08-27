import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import platCouverture from "../plat-couverture.png";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", background: "var(--dily-fond)" }}>
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

        <div style={{ display: "flex", gap: 8 }}>
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

      {/* Hero avec forme verte en fond et photo qui déborde */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "36px 20px 30px",
          background: "linear-gradient(180deg, #E1F5EE 0%, var(--dily-fond) 100%)",
        }}
      >
        {/* Forme décorative verte derrière la photo */}
        <div
          style={{
            position: "absolute",
            top: -40,
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "var(--dily-vert)",
            opacity: 0.9,
          }}
        />

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: "1 1 55%" }}>
            <h1 style={{ fontSize: 24, margin: "0 0 8px", color: "var(--dily-vert-fonce)", lineHeight: 1.2 }}>
              Ton déjeuner, livré au bureau
            </h1>
            <p style={{ fontSize: 14, color: "var(--dily-texte-clair)", margin: 0 }}>
              De vrais plats de cuisine africaine, choisis en 1 minute, livrés
              chaque midi sur ton lieu de travail.
            </p>
          </div>

          <div style={{ flex: "1 1 40%", display: "flex", justifyContent: "flex-end" }}>
            <img
              src={platCouverture}
              alt="Plat africain Dily resto"
              style={{
                width: "100%",
                maxWidth: 180,
                aspectRatio: "1 / 1",
                borderRadius: "50%",
                objectFit: "cover",
                boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
                border: "4px solid white",
              }}
            />
          </div>
        </div>

        <button
          onClick={() => navigate("/commander")}
          style={{
            marginTop: 24,
            width: "100%",
            padding: "16px",
            borderRadius: 14,
            border: "none",
            background: "var(--dily-vert)",
            color: "white",
            fontSize: 17,
            fontWeight: 700,
          }}
        >
          Commander mon plat →
        </button>
      </section>

      {/* Cartes livraison */}
      <section style={{ padding: "20px 20px 0", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1, padding: 16, borderRadius: 14, background: "#EAF7F0", border: "1px solid #CDE9DB" }}>
            <div style={{ fontSize: 26 }}>🎁</div>
            <p style={{ margin: "8px 0 0", fontWeight: 700, fontSize: 14 }}>5 premières livraisons</p>
            <p style={{ margin: 0, color: "var(--dily-vert)", fontWeight: 700 }}>GRATUITES !</p>
          </div>
          <div style={{ flex: 1, padding: 16, borderRadius: 14, background: "#FDF3E7", border: "1px solid #F3DDB8" }}>
            <div style={{ fontSize: 26 }}>🛵</div>
            <p style={{ margin: "8px 0 0", fontSize: 14 }}>Frais de livraison</p>
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
