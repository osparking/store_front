import React, { useState } from "react";
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
import { Link, useNavigation } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { loginUser } from "./AuthService";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "jbpark03@email.com",
    password: "1234",
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
  const navigation = useNavigation();
  const actLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      setErrorMsg("바른 이메일과 비밀번호를 입력하세요.");
      setAlertError(true);
      return;
    }
    try {
      const userId = await loginUser(credentials.email, credentials.password);
      console.log("유저ID: ", userId);
      localStorage.setItem("userId", userId);
      clearLoginForm();
      navigation.navigate("/")
    } catch (error) {
      console.log("에러: ", error);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  const clearLoginForm = () => {
    setCredentials({ email: "", password: "" });
    setAlertError(false);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={6}>
          <Card>
            {alertError && (
              <AlertMessage type={"danger"} message={errM} />
            )}
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
                <Button
                  variant="outline-primary"
                  type="submit"
                  className="w-100"
                >
                  로그인
                </Button>
              </Form>
              <div className="text-center mt-2">
                혹은,&nbsp;
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
