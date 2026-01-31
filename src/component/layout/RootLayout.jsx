import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import Footer from "./Footer";
import NavBar from "./NavBar";
import "./RootLayout.css";

const RootLayout = () => {
  return (
    <main>
      <NavBar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <BackgroundImageSlider />
      <div className="main-content">
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default RootLayout;
