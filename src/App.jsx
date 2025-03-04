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
      <BackgroundImageSlider>
        <h4 className="text-primary text-center mt-5">
          범이비누가 환영합니다.
        </h4>
        <Home />
      </BackgroundImageSlider>
    </main>
  );
}

export default App;
