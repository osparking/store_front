import { Outlet, useLocation } from "react-router-dom";
import { getStorageToken } from "../util/utilities";
import { clearLoginUserInfo } from "./AuthService";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAlerted = useRef(false); // Strict Mode 중복 실행 방지

  // 렌더링 중에 순수하게 상태 확인
  const loggedIn = !!getStorageToken();
  const user = JSON.parse(localStorage.getItem("USER")) || {};
  const userRoles = user.roles || [];
  const isAuthorized = userRoles
    .map((role) => role.toLowerCase())
    .some((uRole) => allowedRoles.map((r) => r.toLowerCase()).includes(uRole));

  useEffect(() => {
    // Strict Mode에서 두 번 호출되어도 ref로 한 번만 실행
    if (hasAlerted.current) return;
    hasAlerted.current = true;

    if (!loggedIn) {
      clearLoginUserInfo();
      sessionStorage.setItem(
        "preLoginUrl",
        location.pathname + location.search,
      );
      alert("등록 및 로그인이 필요 합니다.");
      navigate("/login", { state: { from: location }, replace: true });
    } else if (!isAuthorized) {
      clearLoginUserInfo();
      sessionStorage.setItem(
        "preLoginUrl",
        location.pathname + location.search,
      );
      alert("권한이 없습니다. 다시 로그인 해주세요.");
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [loggedIn, isAuthorized, location, navigate]);

  // 인증 및 권한 통과 시 정상 렌더링
  if (loggedIn && isAuthorized) {
    return useOutlet ? <Outlet /> : children;
  }

  // 리다이렉트 중에는 아무것도 렌더링하지 않음 (또는 로딩 표시)
  return null;
};

export default ProtectedRoute;
