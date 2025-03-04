import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./component/home/Home";
import BackgroundImageSlider from "./component/common/BackgroundImageSlider";
import { Route } from "react-router-dom";
import RootLayout from "./component/layout/RootLayout";

function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
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
