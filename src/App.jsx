import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Home from "./component/home/Home";
import BackgroundImageSlider from "./component/common/BackgroundImageSlider";

function App() {
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
