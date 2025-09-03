import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect } from "react";
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
import ProtectedRoute from "./component/auth/ProtectedRoute";
import Unauthorized from "./component/auth/Unauthorized";
import BuySoap from "./component/buy/BuySoap";
import Recepient from "./component/buy/Recepient";
import Home from "./component/home/Home";
import RootLayout from "./component/layout/RootLayout";
import SoapIntro from "./component/soaps/SoapIntro";
import RegisterUser from "./component/user/RegisterUser";
import UserUpdate from "./component/user/UpdateUser";
import UserDashboard from "./component/user/UserDashboard";
import WorkerDashboard from "./component/worker/WorkerDashboard";
import useTabCounter from "./component/util/useTabCounter";

function App() {

  useEffect(() => {
    const tabId = Date.now() + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem("TAB_ID", tabId);

    // Update tab count in localStorage
    const updateTabCount = (increment) => {
      const storedTabs = JSON.parse(
        localStorage.getItem("ACTIVE_TABS") || "{}"
      );

      if (increment) {
        storedTabs[tabId] = Date.now();
      } else {
        delete storedTabs[tabId];
      }

      localStorage.setItem("ACTIVE_TABS", JSON.stringify(storedTabs));
      localStorage.setItem("TAB_COUNT", Object.keys(storedTabs).length);
    };   

    updateTabCount(true);  

    const handleBeforeUnload = (event) => {
      updateTabCount(false);
      // This message might not be shown in modern browsers
      const message = 'Are you sure you want to leave? Changes may not be saved.';
      event.preventDefault();
      event.returnValue = message; // Standard for most browsers
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup
    return () => {
      updateTabCount(false);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);  

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
        {/* 인증이 필요한 루트 */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN", "ROLE_CUSTOMER"]}
              useOutlet={true}
            />
          }
        >
          <Route path="/buy_soap" element={<BuySoap />} />
          <Route path="/shopping_cart" element={<BuySoap showCart={true} />} />
          <Route path="/recepient" element={<Recepient />} />
        </Route>
        <Route path="/work_item" element={<WorkerDashboard />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>
    )
  );

  return (
    <main className="">
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
