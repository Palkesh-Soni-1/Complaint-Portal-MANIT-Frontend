import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Header/Navbar";
import Footer from "../components/Footer";
import { scrollUp } from "../services/scrollUp";

const Layout = () => {
  const { pathname } = useLocation();

  useEffect(scrollUp, [pathname]);
  return (
    <div>
      <Navbar/>
      <Outlet />
      <Footer/>
    </div>
  );
};

export default Layout;
