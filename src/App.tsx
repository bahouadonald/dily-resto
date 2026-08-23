import { BrowserRouter, Routes, Route } from "react-router-dom";
import CataloguePlats from "./pages/CataloguePlats";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CataloguePlats />} />
        {/* Prochaine étape : route /restaurant/:id pour le profil restaurant */}
      </Routes>
    </BrowserRouter>
  );
}
