import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToUser } from "../common/JwtUtils";
import CodeEntryModal from "./CodeEntryModal";

const OAuth2RedirectHandler = () => {
  const [showCodeModal, setShowCodeModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [jwtToken, setJwtToken] = useState("");

  const loginAfterProcessing = (user, token) => {
    localStorage.setItem("USER", JSON.stringify(user));

    localStorage.setItem("LOGIN_ID", user.id);
    localStorage.setItem("TOKEN", token);

    localStorage.setItem("IS_ADMIN", user.isAdmin);
    window.dispatchEvent(new Event("loginEvt"));
    navigate(`/dashboard/${user.id}/user`);
  };

  const hideCodeModal = () => {
    setShowCodeModal(false);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const user = jwtToUser(token);

        if (user.twoFaEnabled) {
          setShowCodeModal(true);
          setJwtToken(token);
          setUser(user);
        } else {
          loginAfterProcessing(user, token);
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

  return (
    <Container className="mt-5">
      {showCodeModal && (
        <CodeEntryModal
          show={showCodeModal}
          handleHide={hideCodeModal}
          jwtToken={jwtToken}
          user={user}
        />
      )}
      <div>소셜 로그인 재방향...</div>
    </Container>
  );
};

export default OAuth2RedirectHandler;
