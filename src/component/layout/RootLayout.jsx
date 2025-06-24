import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";
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
    </main>
  );
};

export default RootLayout;
