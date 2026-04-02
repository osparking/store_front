import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import Footer from "./Footer";
import NavBar from "./NavBar";
import "./RootLayout.css";

const RootLayout = () => {
  return (
    <div className="main-content">
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
    </div>
  );
};

export default RootLayout;
