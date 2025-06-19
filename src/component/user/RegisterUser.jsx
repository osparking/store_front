import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import BsAlertHook from "../hook/BsAlertHook";
import WorkerDeptSelector from "../worker/WorkerDeptSelector";
import { registerUser } from "./UserService";
import { logoutUser } from "../auth/AuthService";

const RegisterUser = () => {
  const loginId = localStorage.getItem("LOGIN_ID");
  const userRoles = localStorage.getItem("userRoles") || [];
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
    password: "",
    userType: "",
    dept: "",
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
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loginId && !userRoles.includes("ROLE_ADMIN")) {
      const confirmed = window.confirm(
        "로그아웃하고 계정을 등록할까요?"
      );
      if (confirmed) {
        logoutUser();
      } else {
        return;
      }
    }
    try {
      setIsProcessing(true);
      const response = await registerUser(user);
      console.log("response: ", response);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.error("에러:", error);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setUser({
      fullName: "",
      mbPhone: "",
      email: "",
      password: "",
      userType: "",
      dept: "",
    });
  };

  const easyData = () => {
    setUser({
      fullName: "김성훈",
      mbPhone: "010-1234-1223",
      email: "jbpark03@email.com",
      password: "1234",
      userType: "CUSTOMER",
      dept: "생산부",
    });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header className="text-center">
                <legend>사용자 등록</legend>
              </Card.Header>
              <Card.Body>
                <Form.Group as={Row} controlId="full-name" className="mb-4">
                  <Col xs={6} className="mb-2 mb-sm-0">
                    <Form.Label>성명</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="(성명)"
                      value={user.fullName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Form.Group>

                <fieldset className="mb-4">
                  <Form.Label>연락처</Form.Label>
                  <Row>
                    <Col xs={6} className="mb-3 mb-sm-0">
                      <Form.Control
                        type="email"
                        name="email"
                        placeholder="(이메일)"
                        value={user.email}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col xs={6}>
                      <Form.Control
                        type="text"
                        name="mbPhone"
                        placeholder="(휴대폰 번호)"
                        value={user.mbPhone}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>

                <Form.Group as={Row} controlId="password" className="mb-4">
                  <Col>
                    <Form.Label>패스워드</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      required
                      placeholder="(비밀번호)"
                      value={user.password}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="user-type" className="mb-4">
                  <Col>
                    <Form.Label>계정 유형</Form.Label>
                    <Form.Control
                      as="select"
                      name="userType"
                      required
                      value={user.userType}
                      onChange={handleChange}
                    >
                      <option value="">(계정 타입)</option>
                      <option value="CUSTOMER">고객</option>
                      <option value="WORKER">직원</option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                {user.userType === "WORKER" && (
                  <Form.Group>
                    <Row>
                      <Col>
                        <WorkerDeptSelector
                          workerDept={user.dept}
                          onChange={handleChange}
                        />
                      </Col>
                    </Row>
                  </Form.Group>
                )}

                <div className="d-flex justify-content-center mb-3 mt-3">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <ProcessSpinner message="유저 등록" />
                    ) : (
                      "등록"
                    )}
                  </Button>
                  <Button
                    variant="outline-info"
                    size="sm"
                    onClick={handleReset}
                  >
                    리셋
                  </Button>
                </div>

                <div className="d-flex justify-content-center mb-3 mt-3">
                  <Button
                    variant="outline-warning"
                    size="sm"
                    onClick={easyData}
                  >
                    입력 편의
                  </Button>
                </div>
                {alertSuccess && (
                  <>
                    <AlertMessage type="success" message={successMsg} />
                    <p className="text-danger">*등록한 이메일에 로그인하여 메일 주소를 검증하십시오</p>
                  </>                  
                )}
                {alertError && (
                  <AlertMessage type="danger" message={errorMsg} />
                )}
                <div className="text-center">
                  이미 등록한 경우:{" "}
                  <Link to={"/login"} style={{ textDecoration: "none" }}>
                    로그인
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser;
