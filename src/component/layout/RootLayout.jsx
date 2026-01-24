import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
import Footer from "./Footer";
import NavBar from "./NavBar";

const RootLayout = () => {
  return (
    <main>
      <NavBar />
      <Toaster position="bottom-center" reverseOrder={false} />
      <BackgroundImageSlider />
      <div>
        <Outlet />
      </div>
      <Footer />
    </main>
  );
};

export default RootLayout;
