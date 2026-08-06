import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getStorageToken } from "../util/utilities";
import { clearLoginUserInfo } from "./AuthService";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const loggedIn = getStorageToken() ? true : false;
  const user = JSON.parse(localStorage.getItem("USER")) || [];
  const userRoles = user.roles || [];
  const location = useLocation();

  if (!loggedIn) {
    // Store the protected URL in sessionStorage or state
    clearLoginUserInfo();
    sessionStorage.setItem("preLoginUrl", location.pathname + location.search);
    alert("등록 및 로그인이 필요 합니다.");

    // login 페이지로 보내고, (로그인 후 복귀할 수 있게) 직전 위치 기억
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  const userRolesLower = userRoles.map((role) => role.toLowerCase());
  const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());
  const isAuthorized = userRolesLower.some((uRole) =>
    allowedRolesLower.includes(uRole),
  );

  if (isAuthorized) {
    // Outlet 태그 혹은 자식 성분을 표출
    return useOutlet ? <Outlet /> : children;
  } else {
    // 로그인 페이지로 재방향
    clearLoginUserInfo();
    sessionStorage.setItem("preLoginUrl", location.pathname + location.search);
    alert("권한이 없습니다. 다시 로그인 해주세요.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
