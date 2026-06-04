import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import Footer from "./Footer";
import NavBar from "./NavBar";
import "./RootLayout.css";
import { createContext, useCallback, useMemo, useState } from "react";

export const RootContext = createContext();

const RootLayout = () => {
  const [userVersion, setUserVersion] = useState(157);

  const refreshUser = useCallback(() => {
    setUserVersion((prev) => prev + 1);
  }, []);

  const userContext = useMemo(() => ({
    userVersion,
    refreshUser
  }), [userVersion, refreshUser]);

  return (
    <div className="main-content">
      <RootContext.Provider value={userContext}>
        <NavBar />
        <Toaster
          position="top-center"
          containerClassName="container-top150-center"
          toastOptions={{
            className: "custom-toast",
            duration: 4000, // Optional: set duration
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
          reverseOrder={false}
        />
        <BackgroundImageSlider />
        <Outlet />
        <Footer />
      </RootContext.Provider>
    </div>
  );
};

export default RootLayout;
