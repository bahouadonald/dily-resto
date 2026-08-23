import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CataloguePlats from "./pages/CataloguePlats";
import ProfilRestaurant from "./pages/ProfilRestaurant";
import Panier from "./pages/Panier";
import Livraison from "./pages/Livraison";
import Paiement from "./pages/Paiement";
import SuiviCommande from "./pages/SuiviCommande";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CataloguePlats />} />
          <Route path="/restaurant/:id" element={<ProfilRestaurant />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/livraison" element={<Livraison />} />
          <Route path="/paiement" element={<Paiement />} />
          <Route path="/suivi/:id" element={<SuiviCommande />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
