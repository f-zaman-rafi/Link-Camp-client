import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "../Pages/SharedComponants/Footer/Footer";
import Navbar from "../Pages/SharedComponants/Navbar/Navbar";

const Main = () => {
  const location = useLocation();
  const noLayoutRoutes = ["/sign-in", "/sign-up"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <>
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

export default Main;
