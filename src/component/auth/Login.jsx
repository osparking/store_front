import { useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { BsLockFill, BsPersonFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import naverIcon from "../../assets/images/btnD_icon_square.png";
import AlertMessage from "../common/AlertMessage";
import { jwtToUser } from "../common/JwtUtils";
import BsAlertHook from "../hook/BsAlertHook";
import { api } from "../util/api";
import { loginUser } from "./AuthService";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "customer1@email.com",
    password: "1234",
    save_login: true,
  });
  const [code, setCode] = useState("");
  const [codeNeeded, setCodeNeeded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [jwtToken, setJwtToken] = useState("");
  const [user, setUser] = useState();
  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // 구글 인증기 코드 제출 함수
  const submitCode = async (e) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

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

  const changeCode = (e) => {
    setCode(e.target.value);
  };

  const handleCheckChange = (e) => {
    // setCredentials({ ...credentials, [e.target.name]: e.target.checked });
  };

  const loginAfterProcessing = (user, token) => {
    localStorage.setItem("USER", JSON.stringify(user));

    localStorage.setItem("LOGIN_ID", user.id);
    localStorage.setItem("TOKEN", token);

    localStorage.setItem("IS_ADMIN", user.isAdmin);
    window.dispatchEvent(new Event("loginEvt"));
    clearLoginForm();
    navigate(`/dashboard/${user.id}/user`);
  };

  const navigate = useNavigate();
  const actLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMsg("바른 이메일과 비밀번호를 입력하세요.");
      setAlertError(true);
      return;
    }
    try {
      const response = await loginUser(credentials.email, credentials.password);
      const data = response.data.data;
      if (response.status === 200) {
        let user = jwtToUser(data.token);
        if (user.twoFaEnabled) {
          setUser(user);
          setJwtToken(data.token);
          setCodeNeeded(true);
        } else {
          loginAfterProcessing(user, data.token);
        }
      }
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  const clearLoginForm = () => {
    setCredentials({ email: "", password: "" });
    setAlertError(false);
  };

  const googleLogin = () => {
    window.location.href = "http://localhost:9193/oauth2/authorization/google";
  };

  const loginEntryCard = () => {
    return (
      <Card>
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        <Card.Body>
          <Card.Title className="text-center mb-4">로그인</Card.Title>
          <Form onSubmit={actLogin}>
            <Form.Label>이메일</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <BsPersonFill />
              </InputGroup.Text>
              <Form.Control
                type="email"
                name="email"
                placeholder="(이메일)"
                value={credentials.email}
                onChange={handleChange}
              />
            </InputGroup>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>비밀번호</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <BsLockFill />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="(비밀번호)"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </InputGroup>
            </Form.Group>
            <div className="ms-5">
              <Form.Check
                type="switch"
                name="save_login"
                checked={credentials.save_login}
                onChange={handleCheckChange}
                label="로그인 유지"
              />
            </div>
            <Button variant="outline-primary" type="submit" className="w-100">
              로그인
            </Button>
          </Form>
          <div className="text-center mt-3 mb-3">
            <button
              className="button button-solid"
              onClick={naverLogin}
              style={{ margin: "10px" }}
            >
              <img height="18" src={naverIcon} />
              네이버 로그인
            </button>
            <button
              className="button button-solid"
              onClick={googleLogin}
              style={{ margin: "10px" }}
            >
              <FcGoogle />
              Google 로그인
            </button>
          </div>
          <div className="text-center mt-2">
            <Link to={"/register_user"} style={{ textDecoration: "none" }}>
              계정 등록
            </Link>
          </div>
        </Card.Body>
      </Card>
    );
  };

  const codeEntryCard = () => {
    return (
      <Card>
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        <Card.Body>
          <Card.Title className="text-center mb-4">구글 인증기 코드</Card.Title>
          <Form onSubmit={submitCode}>
            <Form.Label>휴대폰 앱에 표시된 코드를 입력하세요</Form.Label>
            <InputGroup>
              <InputGroup.Text>인증 코드</InputGroup.Text>
              <Form.Control
                type="text"
                name="code"
                placeholder="123456"
                value={code}
                required
                onChange={changeCode}
              />
            </InputGroup>
            <Button
              variant="outline-primary"
              type="submit"
              className="w-100 mt-3"
            >
              {verifying ? <span>검증 중...</span> : "인증 코드 제출"}
            </Button>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant="outline-primary"
                className="w-60 mt-5"
                onClick={() => {
                  setCodeNeeded(false);
                }}
              >
                로그인 페이지로...
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    );
  };

  const naverLogin = () => {};
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={codeNeeded ? 4 : 6}>
          {codeNeeded ? codeEntryCard() : loginEntryCard()}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
