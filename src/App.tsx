import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Accueil from "./pages/Accueil";
import CataloguePlats from "./pages/CataloguePlats";
import ProfilRestaurant from "./pages/ProfilRestaurant";
import Panier from "./pages/Panier";
import Livraison from "./pages/Livraison";
import Paiement from "./pages/Paiement";
import SuiviCommande from "./pages/SuiviCommande";
import InscriptionTravailleur from "./pages/InscriptionTravailleur";
import Connexion from "./pages/Connexion";
import InscriptionRestaurant from "./pages/InscriptionRestaurant";
import InscriptionConfirmee from "./pages/InscriptionConfirmee";
import GestionMenu from "./pages/GestionMenu";
import CommandesRestaurant from "./pages/CommandesRestaurant";
import InscriptionLivreur from "./pages/InscriptionLivreur";
import TableauDeBordLivreur from "./pages/TableauDeBordLivreur";
import FeuilleDeRoute from "./pages/FeuilleDeRoute";
import GainsLivreur from "./pages/GainsLivreur";
import AdminDashboard from "./pages/AdminDashboard";
import StatsEntreprise from "./pages/StatsEntreprise";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/commander" element={<CataloguePlats />} />
          <Route path="/restaurant/:id" element={<ProfilRestaurant />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/livraison" element={<Livraison />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/suivi/:id" element={<SuiviCommande />} />
          <Route path="/travailleur-inscription" element={<InscriptionTravailleur />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/restaurant-inscription" element={<InscriptionRestaurant />} />
          <Route path="/restaurant/inscription-confirmee" element={<InscriptionConfirmee />} />
          <Route path="/restaurant/menu" element={<GestionMenu />} />
          <Route path="/restaurant/commandes" element={<CommandesRestaurant />} />
          <Route path="/livreur-inscription" element={<InscriptionLivreur />} />
          <Route path="/livreur/tableau-de-bord" element={<TableauDeBordLivreur />} />
          <Route path="/livreur/tournee" element={<FeuilleDeRoute />} />
          <Route path="/livreur/gains" element={<GainsLivreur />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/entreprises" element={<StatsEntreprise />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
