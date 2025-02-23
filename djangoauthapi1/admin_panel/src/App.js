import "./App.css";
import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import LoginReg from "./Components/Login/LoginReg";
import ResetPassword from "./Components/Login/ResetPassword";
import SendPasswordResetEmail from "./Components/Login/SendPasswordResetEmail";
import Header from "./Components/Pages/Header";
import SideBar from "./Components/SideBar/SideBar";
import Home from "./Components/Pages/Home";
import Mainfile from "./Components/Pages/Mainfile";
import ProductAdd from "./Components/Product/CardsAdmin";
import ProductItinerary from "./Components/Product/ProductItinerary";
import ProductInclusionExclusion from "./Components/Product/ProductInclusionExclusion";
import User from "./Components/Pages/User Detail/User";
import AddDestination from "./Components/Product/AddDestination";
import CardsAdmin from "./Components/Product/CardsAdmin";
import Booking from "./Components/Product/Booking";

function App() {
  const { access_token } = useSelector((state) => state.auth);

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }) => {
    return access_token ? children : <Navigate to="/login" />;
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginReg />} />
        <Route path="/sendpasswordresetemail" element={<SendPasswordResetEmail />} />
        <Route path="/reset" element={<ResetPassword />} />
        {/* Protected Routes */}
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <div className="App">
                <Header />
                <div className="main d-flex">
                  <div className="sideBarwrapper">
                    <SideBar />
                  </div>
                  <div className="content">
                    <Routes>
                      <Route path="/" element={<Mainfile />} />
                      <Route path="/home" element={<Home />} />
                      <Route path="productadd/product" element={<AddDestination />} />
                      <Route path="productview/product" element={<CardsAdmin />} />
                      <Route path="productitinerary/product" element={<Booking />} />
                      <Route path="productincexc/product" element={<ProductInclusionExclusion />} />
                      <Route path="productincexc/product" element={<ProductInclusionExclusion />} />
                      <Route path="userdetail/user" element={<User />} />
                      <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
