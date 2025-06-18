import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log("Decoded Token:", decodedToken);
      } catch (error) {
        console.error('토큰 해독 오류:', error);
        navigate('/login');
      }
    } else {
      console.log("오류: URL 중 토큰 부재");
      navigate('/login');
    }
  }, []);
  return <div>소셜 로그인 재방향...</div>;
};

export default OAuth2RedirectHandler;
