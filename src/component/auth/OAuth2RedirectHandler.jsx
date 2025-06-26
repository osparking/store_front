import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtToUser } from "../common/JwtUtils";

const OAuth2RedirectHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [codeNeeded, setCodeNeeded] = useState(false);
  const [user, setUser] = useState();
  const [jwtToken, setJwtToken] = useState("");
  const [code, setCode] = useState("");  

  const loginAfterProcessing = (user, token) => {
    localStorage.setItem("USER", JSON.stringify(user));

    localStorage.setItem("LOGIN_ID", user.id);
    localStorage.setItem("TOKEN", token);

    localStorage.setItem("IS_ADMIN", user.isAdmin);
    window.dispatchEvent(new Event("loginEvt"));
    navigate(`/dashboard/${user.id}/user`);
  };

  const handleSubmit = async (e) => {
    console.log("code submitted:" + code);
  };   

  const handleChange = (e) => {
    // 숫자가 아닌 문자는 제거
    const intValue = e.target.value.replace(/[^0-9]/g, '');    
    setCode(intValue);    
  };

  const codeEntryCard = () => {
    return (
      <form onSubmit={handleSubmit} style={{ backgroundColor: "ivory" }}>
        <h3>구글 인증기 코드</h3>
        <div className="justify-content-center">
          <label htmlFor="code">코드:</label>
          <input
            type="number"
            id="code"
            name="code"
            value={code}
            placeholder="(123456)"
            required
            onChange={handleChange}
          />
        </div>
        <button type="submit">제출</button>
      </form>
    );    
  }; 

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      try {
        localStorage.setItem("TOKEN", token);
        const user = jwtToUser(token);

        if (user.twoFaEnabled) {
          setUser(user);
          setJwtToken(token);
          setCodeNeeded(true);          
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
          {codeNeeded ? codeEntryCard() : <div>소셜 로그인 재방향...</div>}
        </Col>
      </Row>
    </Container>
  );
};

export default OAuth2RedirectHandler;
