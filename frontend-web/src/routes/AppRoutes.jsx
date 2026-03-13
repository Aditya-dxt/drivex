import { BrowserRouter, Routes, Route } from "react-router-dom";

import Drive from "../pages/Drive";
import Trash from "../pages/Trash";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Drive />} />

        <Route path="/drive" element={<Drive />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/trash" element={<Trash />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;