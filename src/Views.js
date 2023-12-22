import React from "react";
import Register from "./components/Register";
import Auth from "./components/Auth/Auth";
import MainLayout from "./components/Layout";
import Profile from "./pages/Profile/Profule";
import Todos from "./pages/Todos/Todos";
import ExportToExcel from "./pages/ExportToExcel/ExportToExcel";
import VerifyToken from "./pages/VerifyToken/VerifyToken";
import { Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Details from "./pages/Todos/Details/Details";

const Views = () => {
  const { token } = useSelector((state) => state.token);
  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/reg" />;
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/todos" element={<Todos />} />
        <Route path="/exportToExcel" element={<ExportToExcel />} />
        <Route path="/todos/:id" element={<Details />} />
      </Route>
      <Route path="/reg" element={<Register />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/email/verify-email/:token" element={<VerifyToken />} />
      <Route path="/email/verify-email" element={<VerifyToken />} />
    </Routes>
  );
};

export default Views;
