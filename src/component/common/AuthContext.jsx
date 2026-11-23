import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMeInfo } from "../customer/CustomerService";
import { getValidToken } from "../util/api";
import { clearAccessToken } from "../util/tokenStore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // 'loading' | 'authenticated' | 'anonymous'
  const [authState, setAuthState] = useState("loading");
  const [identity, setIdentity] = useState(null);
  const [meInfo, setMeInfo] = useState({});

  const refreshAuth = useCallback(async () => {
    setAuthState("loading");
    let nextState = "anonymous";
    let nextIdentity = null;

    try {
      const userFullName = localStorage.getItem("userFullName");
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      if (userFullName) {
        const token = await getValidToken();

        if (token) {
          const meInfo = await fetchMeInfo();

          setMeInfo(meInfo);
          nextIdentity =
            meInfo.loginMethod === "EMAIL"
              ? localStorage.getItem("userFullName")
              : `<${meInfo.loginMethod}>`;
          nextState = "authenticated";
        }
      }
    } catch (e) {
      nextState = "anonymous";
      nextIdentity = null;
    } finally {
      // ✅ 어떤 경로로 끝나든 loading에서 벗어남
      setIdentity(nextIdentity);
      setAuthState(nextState);
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
    <AuthContext.Provider value={{ authState, identity, meInfo, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => useContext(AuthContext);
