import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OAuth2RedirectHandler = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      console.log("JWT:", decodedToken);
    }
  }, []);
  return <div>소셜 로그인 재방향...</div>;
};

export default OAuth2RedirectHandler;
