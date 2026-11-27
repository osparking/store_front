import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../common/AuthContext";
import { removeUserKeys } from "../util/utilities";
import { clearLoginUserInfo } from "./AuthService";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const hasAlerted = useRef(false); // Strict Mode 중복 실행 방지

  // 렌더링 중에 순수하게 상태 확인
  const { authState, meInfo } = useAuthContext();
  const loggedIn = authState === "authenticated";
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  async function notAuthorized() {
    console.log("user: ", meInfo);
    const isAuthorized = meInfo?.roles
      .map((role) => role.toLowerCase())
      .some((uRole) =>
        allowedRoles.map((r) => r.toLowerCase()).includes(uRole),
      );
    return !isAuthorized;
  }

  useEffect(() => {
    const checkAuth = async () => {
      // Strict Mode에서 두 번 호출되어도 ref로 한 번만 실행
      if (hasAlerted.current) return;
      hasAlerted.current = true;

      if (!loggedIn) {
        removeUserKeys();
        sessionStorage.setItem(
          "preLoginUrl",
          location.pathname + location.search,
        );
        toast.error("로그인 후 가능합니다.");
        navigate("/login", { state: { from: location }, replace: true });
      } else {
        const unAuthorized = await notAuthorized();

        if (unAuthorized) {
          clearLoginUserInfo();
          sessionStorage.setItem(
            "preLoginUrl",
            location.pathname + location.search,
          );
          toast.error("다른 사용자로 로그인하세요.");
          navigate("/login", { state: { from: location }, replace: true });
        } else {
          setIsAuthorized(true);
        }
      }
    };
    checkAuth();
  }, [loggedIn, location, navigate]);

  // 인증 및 권한 통과 시 정상 렌더링
  if (loggedIn && isAuthorized) {
    return useOutlet ? <Outlet /> : children;
  }

  // 리다이렉트 중에는 아무것도 렌더링하지 않음 (또는 로딩 표시)
  return null;
};

export default ProtectedRoute;
