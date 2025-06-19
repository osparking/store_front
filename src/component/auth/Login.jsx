import { jwtDecode } from "jwt-decode";
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
import { BsLockFill, BsPersonFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import naverIcon from "../../assets/images/btnD_icon_square.png";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { loginUser } from "./AuthService";
import { jwtToUser } from "../common/JwtUtils";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "customer1@email.com",
    password: "1234",
    save_login: true,
  });
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

  const handleCheckChange = (e) => {
    // setCredentials({ ...credentials, [e.target.name]: e.target.checked });
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
      const apiResp = await loginUser(credentials.email, credentials.password);
      localStorage.setItem("loginId", apiResp.data.id);
      localStorage.setItem("token", apiResp.data.token);

      const user = jwtToUser(apiResp.data.token);

      localStorage.setItem("userRoles", JSON.stringify(user.roles));
      window.dispatchEvent(new Event("loginEvt"));
      clearLoginForm();
      navigate(`/dashboard/${user.id}/user`);
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

  const naverLogin = () => {};

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={6}>
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
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100"
                >
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
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
