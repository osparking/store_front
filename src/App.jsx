import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import AdminDashboard from "./component/admin/AdminDashboard";
import EmailVerifin from "./component/auth/EmailVerifin";
import Login from "./component/auth/Login";
import OAuth2RedirectHandler from "./component/auth/OAuth2RedirectHandler";
import Home from "./component/home/Home";
import RootLayout from "./component/layout/RootLayout";
import SoapIntro from "./component/soaps/SoapIntro";
import RegisterUser from "./component/user/RegisterUser";
import UserUpdate from "./component/user/UpdateUser";
import UserDashboard from "./component/user/UserDashboard";
import WorkerDashboard from "./component/worker/WorkerDashboard";
import BuySoap from "./component/buy/BuySoap";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/register_user" element={<RegisterUser />} />
        <Route path="/email_verifin" element={<EmailVerifin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:id/user" element={<UserDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/user/:id/update" element={<UserUpdate />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/soap_intro" element={<SoapIntro />} />
        <Route path="/buy_soap" element={<BuySoap />} />
        <Route path="/work_item" element={<WorkerDashboard />} />
      </Route>
    )
  );

  useEffect(() => {
    const storedCnt = Number(localStorage.getItem("TAB_COUNT"));
    const tabCount = storedCnt ? storedCnt + 1 : 1;
    localStorage.setItem("TAB_COUNT", tabCount);

    const cleanupLocalStorage = () => {
      const tab_count = Number(localStorage.getItem("TAB_COUNT"));
      if (tab_count <= 1) {
        localStorage.clear();
      } else {
        localStorage.setItem("TAB_COUNT", tab_count - 1);
      }
    };

    window.addEventListener("beforeunload", cleanupLocalStorage);

    return () => {
      window.removeEventListener("beforeunload", cleanupLocalStorage);
    };
  }, []);

  return (
    <main className="">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
