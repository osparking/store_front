import React from "react";
import { Outlet } from "react-router-dom";
import BackgroundImageSlider from "../common/BackgroundImageSlider";

const RootLayout = () => {
  return (
    <main>
      <BackgroundImageSlider />
      <div>
        <Outlet />
      </div>
    </main>
  );
};

export default RootLayout;
