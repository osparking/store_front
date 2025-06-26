import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToUser } from "../common/JwtUtils";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [codeNeeded, setCodeNeeded] = useState(false);

  const loginAfterProcessing = (user, token) => {
    localStorage.setItem("USER", JSON.stringify(user));

    localStorage.setItem("LOGIN_ID", user.id);
    localStorage.setItem("TOKEN", token);

    localStorage.setItem("IS_ADMIN", user.isAdmin);
    window.dispatchEvent(new Event("loginEvt"));
    navigate(`/dashboard/${user.id}/user`);
  };


  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("TOKEN", token);
        const user = jwtToUser(token);

        localStorage.setItem("LOGIN_ID", user.id);
        localStorage.setItem("USER", JSON.stringify(user));
        localStorage.setItem("IS_ADMIN", user.isAdmin);
        window.dispatchEvent(new Event("loginEvt"));
        if (user.isAdmin) {
          navigate("/dashboard/admin");
        } else {
          navigate(`/dashboard/${user.id}/user`);
        }
      } catch (error) {
        console.error("토큰 해독 오류:", error);
        navigate("/login");
      }
    } else {
      console.log("오류: URL 중 토큰 부재");
      navigate("/login");
    }
  }, []);
  return <div>소셜 로그인 재방향...</div>;
};

export default OAuth2RedirectHandler;
