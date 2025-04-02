import "bootstrap/dist/css/bootstrap.min.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";
import Login from "./component/auth/Login";
import Home from "./component/home/Home";
import RootLayout from "./component/layout/RootLayout";
import RegisterUser from "./component/user/RegisterUser";
import UserDashboard from "./component/user/UserDashboard";
import EmailVerifin from "./component/auth/EmailVerifin";
import AdminDashboard from "./component/admin/AdminDashboard";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/register_user" element={<RegisterUser />} />
        <Route path="/email_verifin" element={<EmailVerifin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/:userId/user" element={<UserDashboard />} />
        <Route path="/dashboard/admin" element={<AdminDashboard/>} />
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
