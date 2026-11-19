import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import { getValidToken } from "../util/api";
import { TokenRefreshingError } from "../util/errors";
import { clearAccessToken } from "../util/tokenStore";
import { fetchMeInfo } from "../customer/CustomerService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 'loading' | 'authenticated' | 'anonymous'
  const [authState, setAuthState] = useState("loading");
  const [identity, setIdentity] = useState(null);

  const refreshAuth = useCallback(async () => {
    setAuthState("loading");
    try {
      await getValidToken();
      // 사용자 정보는 백엔드 /me에서 가져오는 것이 이상적
      const user = await fetchMeInfo(); // response.data

      setIdentity(
        user.loginMethod === "EMAIL"
          ? localStorage.getItem("userFullName")
          : `<${user.loginMethod}>`,
      );
      setAuthState("authenticated");
    } catch (e) {
      if (e instanceof TokenRefreshingError) setAuthState("anonymous");
      else setAuthState("anonymous");
      setIdentity(null);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  // 로그인/로그아웃 이벤트 구독
  useEffect(() => {
    const onLogin = () => refreshAuth();
    const onLogout = () => {
      clearAccessToken();
      setAuthState("anonymous");
      setIdentity(null);
    };
    window.addEventListener("loginEvt", onLogin);
    window.addEventListener("logoutEvt", onLogout);
    return () => {
      window.removeEventListener("loginEvt", onLogin);
      window.removeEventListener("logoutEvt", onLogout);
    };
  }, [refreshAuth]);

  return (
    <AuthContext.Provider value={{ authState, identity, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
