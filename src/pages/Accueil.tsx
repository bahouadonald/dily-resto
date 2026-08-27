import { useNavigate } from "react-router-dom";
import logo from "../logo.png";
import platCouverture from "../plat-couverture.png";

export default function Accueil() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--dily-fond)",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          background: "var(--dily-blanc)",
          borderBottom: "1px solid var(--dily-bordure)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <img
            src={logo}
            alt="Dily resto"
            style={{ width: 30, height: 30, borderRadius: 8, objectFit: "cover" }}
          />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Dily resto</span>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button
            onClick={() => navigate("/restaurant-inscription")}
            style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--dily-bordure)", background: "white", fontSize: 11, fontWeight: 600 }}
          >
            Resto
          </button>
          <button
            onClick={() => navigate("/livreur-inscription")}
            style={{ padding: "6px 8px", borderRadius: 6, border: "1px solid var(--dily-bordure)", background: "white", fontSize: 11, fontWeight: 600 }}
          >
            Livreur
          </button>
          <button
            onClick={() => navigate("/connexion")}
            style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: "var(--dily-vert)", color: "white", fontSize: 11, fontWeight: 600 }}
          >
            Connexion
          </button>
        </div>
      </header>

      {/* Contenu principal, tient dans l'écran restant */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "16px 20px",
        }}
      >
        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 21, margin: "0 0 6px", color: "var(--dily-vert-fonce)", lineHeight: 1.15 }}>
              Ton déjeuner, livré au bureau
            </h1>
            <p style={{ fontSize: 13, color: "var(--dily-texte-clair)", margin: "0 0 14px" }}>
              Cuisine africaine, livrée chaque midi sur ton lieu de travail.
            </p>

            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, background: "#EAF7F0", color: "var(--dily-vert)", padding: "4px 8px", borderRadius: 20, fontWeight: 700 }}>
                🎁 5 livraisons offertes
              </span>
            </div>

            <span style={{ fontSize: 11, color: "var(--dily-texte-clair)" }}>
              Livraison dès 150 FCFA, 300 FCFA max
            </span>
          </div>

          <img
            src={platCouverture}
            alt="Plat africain Dily resto"
            style={{
              width: "42%",
              aspectRatio: "3 / 4",
              borderRadius: 16,
              objectFit: "cover",
              boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
            }}
          />
        </div>

        <button
          onClick={() => navigate("/commander")}
          style={{
            marginTop: 20,
            width: "100%",
            padding: "16px",
            borderRadius: 14,
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

      <footer style={{ textAlign: "center", padding: "10px", fontSize: 11, color: "var(--dily-texte-clair)" }}>
        Dily resto — un service Dilycash
      </footer>
    </div>
  );
}
