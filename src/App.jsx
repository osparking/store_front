import "bootstrap/dist/css/bootstrap.min.css";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import "./App.css";

// 즉시 로드가 필요한 레이아웃/인증 관련 컴포넌트는 정적 import 유지
import ProtectedRoute from "./component/auth/ProtectedRoute";
import RootLayout from "./component/layout/RootLayout";

// ------------------------------------------------------------------
// 지연 로딩(lazy loading) 컴포넌트들
// 각 페이지는 해당 라우트 방문 시점에 별도 청크로 로드됩니다.
// ------------------------------------------------------------------

// Home은 첫 방문 페이지일 가능성이 높으므로 정적 import 유지 (선택사항)
import Home from "./component/home/Home";

// 인증 관련
const EmailVerifin = lazy(() => import("./component/auth/EmailVerifin"));
const Login = lazy(() => import("./component/auth/Login"));
const OAuth2RedirectHandler = lazy(
  () => import("./component/auth/OAuth2RedirectHandler"),
);
const Unauthorized = lazy(() => import("./component/auth/Unauthorized"));
const VerifyToken = lazy(() => import("./component/auth/VerifyToken"));

// 관리자 / 워커
const AdminCanvas = lazy(() => import("./component/admin/AdminCanvas"));
const WorkerCanvas = lazy(() => import("./component/worker/WorkerCanvas"));

// 구매 / 결제
const BuySoap = lazy(() => import("./component/buy/BuySoap"));
const Recipient = lazy(() => import("./component/buy/Recipient"));
const FailPage = lazy(() =>
  import("./component/pay_toss/Fail").then((m) => ({ default: m.FailPage })),
);
const WidgetCheckoutPage = lazy(
  () => import("./component/pay_toss/WidgetCheckoutPage"),
);
const WidgetSuccessPage = lazy(() =>
  import("./component/pay_toss/WidgetSuccess").then((m) => ({
    default: m.WidgetSuccessPage,
  })),
);

// 리뷰 / 소개
const ReviewTable = lazy(() => import("./component/soaps/ReviewTable"));
const SoapIntro = lazy(() => import("./component/soaps/SoapIntro"));

// 사용자
const ManageMyOrder = lazy(() => import("./component/user/ManageMyOrder"));
const QuestionEditor = lazy(
  () => import("./component/user/question/QuestionEditor"),
);
const RegisterUser = lazy(() => import("./component/user/RegisterUser"));
const UserUpdate = lazy(() => import("./component/user/UpdateUser"));
const UserDashboard = lazy(() => import("./component/user/UserDashboard"));

// ------------------------------------------------------------------
// 로딩 폴백 컴포넌트
// ------------------------------------------------------------------
function PageLoader() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "60vh",
        fontSize: "1rem",
        color: "#666",
      }}
    >
      로딩 중...
    </div>
  );
}

// ------------------------------------------------------------------
// 라우터 설정
// ------------------------------------------------------------------
function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route path="/register_user" element={<RegisterUser />} />
        <Route path="/email_verifin" element={<EmailVerifin />} />
        <Route path="/verify_token" element={<VerifyToken />} />
        <Route path="/login" element={<Login />} />
        <Route path="/login/" element={<Login />} />
        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
        <Route path="/soap_intro" element={<SoapIntro />} />
        <Route path="/reviews" element={<ReviewTable />} />
        {/* ⚠️ 아래 라우트는 위의 /oauth2/redirect와 중복됩니다.
            라우터는 첫 번째 매칭을 사용하므로 이 Route는 실제로는
            사용되지 않습니다. 의도한 것인지 확인해 주세요. */}
        {/* <Route path="/oauth2/redirect" element={<OAuth2Redirect />} /> */}

        {/* 인증이 필요한 루트 */}
        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN", "ROLE_WORKER", "ROLE_CUSTOMER"]}
              useOutlet={true}
            />
          }
        >
          <Route path="/dashboard/admin" element={<AdminCanvas />} />
          <Route path="/user/:id/update" element={<UserUpdate />} />
          <Route path="/dashboard/:id/user" element={<UserDashboard />} />
          <Route path="/buy_soap" element={<BuySoap />} />
          <Route path="/shopping_cart" element={<BuySoap showCart={true} />} />
          <Route path="/recipient" element={<Recipient />} />
          <Route path="/checkout" element={<WidgetCheckoutPage />} />
          <Route path="/success" element={<WidgetSuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
          <Route path="/myorders" element={<ManageMyOrder />} />
          <Route path="/question" element={<QuestionEditor />} />
        </Route>

        <Route
          element={
            <ProtectedRoute
              allowedRoles={["ROLE_ADMIN", "ROLE_WORKER"]}
              useOutlet={true}
            />
          }
        >
          <Route path="/work_item" element={<WorkerCanvas />} />
        </Route>

        <Route path="/unauthorized" element={<Unauthorized />} />
      </Route>,
    ),
  );

  return (
    <main className="app">
      <Suspense fallback={<PageLoader />}>
        <RouterProvider router={router} />
      </Suspense>
    </main>
  );
}

export default App;
