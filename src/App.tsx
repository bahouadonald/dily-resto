import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import CataloguePlats from "./pages/CataloguePlats";
import ProfilRestaurant from "./pages/ProfilRestaurant";
import Panier from "./pages/Panier";

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CataloguePlats />} />
          <Route path="/restaurant/:id" element={<ProfilRestaurant />} />
          <Route path="/panier" element={<Panier />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
