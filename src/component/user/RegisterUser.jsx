import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import BsAlertHook from "../hook/BsAlertHook";
import ConfirmEmailModal from "../modal/ConfirmEmailModal";
import {
  formatTime,
  handlePhoneChange,
  insertHyphens,
  maskEmail,
} from "../util/utilities";
import WorkerDeptSelector from "../worker/WorkerDeptSelector";
import "./RegisterUser.css";
import { registerUser } from "./UserService";

const RegisterUser = () => {
  const isAdmin = localStorage.getItem("IS_ADMIN") === "true";
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
    password: "",
    userType: isAdmin ? "WORKER" : "CUSTOMER",
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

  const checkIfPasswordsMatch = () => {
    if (user.password !== user.confirmPassword) {
      console.error("두 패스워드가 일치하지 않습니다.");
      throw new Error("두 패스워드가 일치하지 않습니다.");
    }
  };

  const [confirmData, setConfirmData] = useState({
    result: "",
    email: "",
    expireTime: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      checkIfPasswordsMatch();
    } catch (error) {
      setErrorMsg(error.message);
      setAlertError(true);
      return;
    }

    try {
      setIsProcessing(true);
      const response = await registerUser(user);
      const expireTime = response.data.tokenExpireTime;

      setConfirmData({
        result: response.message,
        email: maskEmail(response.data.email),
        expireTime: formatTime(expireTime),
      });

      setShowConfirmEmailModal(true);
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

  const setPhoneNumber = (mbPhone) => {
    setUser({ ...user, mbPhone: mbPhone });
  };

  const easyData = () => {
    setUser({
      fullName: "김성훈",
      mbPhone: "01012345678",
      email: "jbpark103@hanmail.net",
      password: "1234",
      confirmPassword: "1234",
      userType: "CUSTOMER",
      dept: "생산부",
    });
  };

  const [showConfirmEmailModal, setShowConfirmEmailModal] = useState(false);
  const moveToLoginPage = () => {
    setShowConfirmEmailModal(false);
    window.location.href = "/login";
  };

  return (
    <>
      <ConfirmEmailModal
        show={showConfirmEmailModal}
        closer={() => moveToLoginPage()}
        confirmData={confirmData}
        dialogClass="confirm-email-modal"
      />
      <Container
        id="registerContainer"
        className="d-flex justify-content-center"
      >
        <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
          <Card className="shadow registerCard">
            <Card.Header className="text-center">
              <legend>사용자 등록</legend>
            </Card.Header>
            <Card.Body style={{ overflow: "auto" }}>
              <div style={{ width: "475px" }}>
                <fieldset className="mb-4">
                  <Row>
                    <Col xs={4} md={4}>
                      <Form.Label>
                        성명
                        <Form.Control
                          type="text"
                          name="fullName"
                          placeholder="(성명)"
                          value={user.fullName}
                          onChange={handleChange}
                          required
                          style={{ width: "71%" }}
                        />
                      </Form.Label>
                    </Col>
                    <Col
                      xs={4}
                      md={4}
                      className="d-flex justify-content-center"
                    >
                      <Form.Label>
                        계정 유형
                        <Form.Control
                          as="select"
                          name="userType"
                          required
                          value={user.userType}
                          onChange={handleChange}
                        >
                          <option value="">(계정 타입)</option>
                          <option value="CUSTOMER">고객</option>
                          <option value="WORKER" disabled={!isAdmin}>
                            직원
                          </option>
                        </Form.Control>
                      </Form.Label>
                    </Col>
                    <Col
                      xs={4}
                      md={4}
                      className="employeeAffiliation d-flex justify-content-end"
                    >
                      <Form.Label>
                        부서
                        <WorkerDeptSelector
                          disabled={user.userType !== "WORKER"}
                          workerDept={user.dept}
                          onChange={handleChange}
                        />
                      </Form.Label>
                    </Col>
                  </Row>
                </fieldset>

                <fieldset className="mb-4">
                  <Row>
                    <Col xs={6} className="mb-2 mb-sm-0">
                      <Form.Label>
                        이메일
                        <Form.Control
                          type="email"
                          name="email"
                          autoComplete="email"
                          placeholder="(이메일)"
                          value={user.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Label>
                    </Col>
                    <Col xs={6}>
                      <Form.Label>
                        휴대폰 번호
                        <Form.Control
                          type="tel"
                          name="mbPhone"
                          autoComplete="tel"
                          placeholder="(휴대폰 번호)"
                          value={insertHyphens(user.mbPhone)}
                          onChange={(e) => handlePhoneChange(e, setPhoneNumber)}
                          required
                        />
                      </Form.Label>
                    </Col>
                  </Row>
                </fieldset>

                <Form.Group as={Row} className="mb-2">
                  <Col xs={6}>
                    <Form.Label>
                      패스워드
                      <Form.Control
                        type="password"
                        name="password"
                        id="password"
                        autoComplete="new-password"
                        required
                        placeholder="(비밀번호)"
                        value={user.password || ""}
                        onChange={handleChange}
                      />
                    </Form.Label>
                  </Col>
                  <Col xs={6}>
                    <Form.Label>
                      패스워드 확인
                      <Form.Control
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="new-password-confirm"
                        required
                        placeholder="(비밀번호 확인)"
                        value={user.confirmPassword || ""}
                        onChange={handleChange}
                      />
                    </Form.Label>
                  </Col>
                </Form.Group>
              </div>
            </Card.Body>

            <Card.Footer className="text-center">
              <div className="d-flex justify-content-center mb-3 mt-3 gap-4 char2button">
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  리셋
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ProcessSpinner message="유저 등록" />
                  ) : (
                    "등록"
                  )}
                </Button>
              </div>

              {isAdmin && (
                <div className="d-flex justify-content-center char2button mb-3 mt-3">
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={easyData}
                  >
                    입력 편의
                  </Button>
                </div>
              )}
              {alertSuccess && (
                <>
                  <AlertMessage type="success" message={successMsg} />
                  <p className="text-danger">
                    *등록한 이메일에 로그인하여 메일 주소를 검증하십시오
                  </p>
                </>
              )}
              {alertError && <AlertMessage type="danger" message={errorMsg} />}
              <div className="text-center">
                이미 등록한 경우:{" "}
                <Link to={"/login"} style={{ textDecoration: "none" }}>
                  로그인
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Form>
      </Container>
    </>
  );
};

export default RegisterUser;
