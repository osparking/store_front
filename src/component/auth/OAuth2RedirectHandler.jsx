import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToUser } from "../common/JwtUtils";
import { api } from "../util/api";
import CodeEntryCard from "./CodeEntryCard";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [codeNeeded, setCodeNeeded] = useState(false);
  const [user, setUser] = useState();
  const [jwtToken, setJwtToken] = useState("");
  const [code, setCode] = useState("");  
  const [verifying, setVerifying] = useState(false);

  const loginAfterProcessing = (user, token) => {
    localStorage.setItem("USER", JSON.stringify(user));

    localStorage.setItem("LOGIN_ID", user.id);
    localStorage.setItem("TOKEN", token);

    localStorage.setItem("IS_ADMIN", user.isAdmin);
    window.dispatchEvent(new Event("loginEvt"));
    navigate(`/dashboard/${user.id}/user`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      console.log("submitted data: " + JSON.stringify(formData));
      const result = await api.post(
        "/autho/public/verify-2fa-login",
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      loginAfterProcessing(user, jwtToken);
    } catch (error) {
      toast.error("구글 코드 검증 오류!");
    } finally {
      setVerifying(false);
    }
  };   

  const handleChange = (e) => {
    // 숫자가 아닌 문자는 제거
    const intValue = e.target.value.replace(/[^0-9]/g, '');    
    setCode(intValue);    
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        const user = jwtToUser(token);

        if (user.twoFaEnabled) {
          setCodeNeeded(true);          
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
      <Row className="justify-content-center">
        <Col sm="5">
          {codeNeeded ? (
            <CodeEntryCard
              setCodeNeeded={setCodeNeeded}
              jwtToken={jwtToken}
              user={user}
            />
          ) : (
            <div>소셜 로그인 재방향...</div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default OAuth2RedirectHandler;
