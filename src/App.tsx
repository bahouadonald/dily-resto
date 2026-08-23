import { BrowserRouter, Routes, Route } from "react-router-dom";
import CataloguePlats from "./pages/CataloguePlats";
import ProfilRestaurant from "./pages/ProfilRestaurant";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CataloguePlats />} />
        <Route path="/restaurant/:id" element={<ProfilRestaurant />} />
      </Routes>
    </BrowserRouter>
  );
}
