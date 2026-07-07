import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { BsLockFill, BsPersonFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import naverIcon from "../../assets/images/btnD_icon_square.png";
import AlertMessage from "../common/AlertMessage";
import { jwtToUser } from "../common/JwtUtils";
import BsAlertHook from "../hook/BsAlertHook";
import ConfirmResultModal from "../modal/ConfirmResultModal";
import EnableAccountModal from "../modal/EnableAccountModal";
import {
  formatTime,
  HTTP_STATUS,
  storeJWT,
  storeLoginInfo,
} from "../util/utilities";
import { getEmailViaToken, loginUser } from "./AuthService";
import CodeEntryModal from "./CodeEntryModal";
import "./Login.css";
import { resetPassword } from "../user/UserService";

const Login = () => {
  const localUser = localStorage.getItem("USER");
  let isLoggedIn = false;

  try {
    const userData = JSON.parse(localUser);
    isLoggedIn = userData && typeof userData === "object" && userData.id;
  } catch {
    isLoggedIn = false;
  }

  // 이미 로그인되어 있으면 홈으로 보내기
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  const [showCodeModal, setShowCodeModal] = useState(false);

  const [showEnableModal, setShowEnableModal] = useState(false);
  const handleModalXButtonClick = () => {
    setShowEnableModal(false);
  };

  const isDevelopment = process.env.NODE_ENV === "development";

  const [credentials, setCredentials] = useState(
    isDevelopment
      ? {
          email: "jbpark103@hanmail.net",
          password: "1234",
          save_login: localStorage.getItem("SAVE_LOGIN") === "true",
        }
      : {
          email: "",
          password: "",
          save_login: localStorage.getItem("SAVE_LOGIN") === "true",
        },
  );

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

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (token) {
          try {
            const response = await getEmailViaToken(token);
            const email = response.data.email;

            if (email) {
              setCredentials({ ...credentials, email: email });
              setShowEnableModal(true);

              // 보안: 모달 뜬 후 URL에서 token 제거 (히스토리 정리)
              window.history.replaceState(null, "", "/login");
            } else {
              console.error("토큰 만료 또는 오류");
            }
          } catch (e) {
            console.error("email error: ", e);
          }
        }
      } catch (e) {
        console.error("token error: ", e);
      }
    };
    fetchToken();
  }, []);

  useEffect(() => {
    localStorage.setItem("SAVE_LOGIN", credentials.save_login);
  }, [credentials.save_login]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleCheckChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.checked });
  };

  const navigate = useNavigate();
  const location = useLocation();

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
      if (response.status === HTTP_STATUS.OK) {
        let user = jwtToUser(data.token);
        if (user.twoFaEnabled) {
          setUser(user);
          setJwtToken(data.token);
          setShowCodeModal(true);
        } else {
          storeLoginInfo(user);
          storeJWT(data.token, credentials.save_login);
          window.dispatchEvent(new Event("loginEvt"));
          navigate(location.state?.from || "/", {
            replace: true,
          });
        }
      } else if (response.status === HTTP_STATUS.CLOSED) {
        setShowEnableModal(true);
      } else if (response.status === HTTP_STATUS.ALREADY_REPORTED) {
        setErrorMsg(response.data.message);
        setAlertError(true);
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setErrorMsg("이메일 또는 비밀번호 오류입니다.");
      setAlertError(true);
    }
  };

  const handleOauth2Login = (provider) => {
    window.location.href = `http://localhost:9193/oauth2/authorization/${provider}`;
  };

  /**
   * Checks whether a given string is a syntactically valid email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} - True if the email appears syntactically correct, false otherwise.
   */
  function isValidEmail(email) {
    // Trim whitespace to avoid false negatives
    const trimmed = email.trim();
    if (trimmed === "") return false;

    // Basic email regex:
    // - Local part: letters, digits, dots, underscores, percent, plus, hyphen
    // - Domain part: letters, digits, hyphens, dots (must have at least one dot)
    // - Top-level domain: at least two letters
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(trimmed);
  }

  const reset_password = async () => {
    try {
      const response = await resetPassword(credentials.email);
      setShowConfirmModal(true);
      toast.success(response.message);
    } catch (error) {
      toast.error("존재하지 않는 계정 이메일입니다.");
    }
  };

  const loginEntryCard = () => {
    return (
      <Card style={{ height: "fit-content", marginTop: 0 }}>
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        <Card.Body>
          <Card.Title id="login-title" className="text-center mb-4">
            로그인
          </Card.Title>
          <Form onSubmit={actLogin}>
            <Form.Group className="mb-3" controlId="email">
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
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>
                비밀번호
                <OverlayTrigger
                  overlay={<Tooltip>이메일 완성 때, 활성화됨</Tooltip>}
                >
                  <span style={{ display: "inline-block" }}>
                    <Button
                      id="pwdReset"
                      variant="success"
                      disabled={!isValidEmail(credentials.email)}
                      onClick={reset_password}
                    >
                      재설정
                    </Button>
                  </span>
                </OverlayTrigger>
              </Form.Label>
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
            <div className="d-flex justify-content-center">
              <Button variant="outline-primary" type="submit" className="w-75">
                로그인(엔터)
              </Button>
            </div>
            <div
              id="save-login-container"
              className="d-flex justify-content-center mt-3 mb-0"
            >
              <p className="me-2">[7일 간]</p>
              <Form.Check
                type="switch"
                name="save_login"
                checked={credentials.save_login}
                onChange={handleCheckChange}
                label="로그인 유지"
              />
            </div>
          </Form>
          <div className="text-center mt-0 mb-3">
            <button
              className="button button-solid"
              onClick={() => handleOauth2Login("naver")}
              style={{ margin: "10px" }}
            >
              <img height="18" src={naverIcon} />
              네이버 로그인
            </button>
            <button
              className="button button-solid"
              onClick={() => handleOauth2Login("google")}
              style={{ margin: "10px" }}
            >
              <FcGoogle />
              구글 로그인
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

  const hideCodeModal = () => {
    setShowCodeModal(false);
  };

  const [enableResult, setEnableResult] = useState(null);
  const [switchLabel, setSwitchLabel] = useState("");
  const [expireTime, setExpireTime] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (enableResult) {
      setSwitchLabel(enableResult.message);
      setExpireTime(formatTime(enableResult.expireTime));
      setShowConfirmModal(true);
    }
  }, [enableResult]);

  return (
    <Container fluid id="login-container" style={{ position: "relative" }}>
      {showCodeModal && (
        <CodeEntryModal
          show={showCodeModal}
          handleHide={hideCodeModal}
          jwtToken={jwtToken}
          user={user}
          save_login={credentials.save_login}
        />
      )}
      <Row id="login-row" className="justify-content-center">
        <Col
          id="login-col"
          style={{ maxWidth: "500px", minHeight: "450px", overflow: "auto" }}
        >
          <Container className="d-flex justify-content-center align-items-center h-100">
            {loginEntryCard()}
          </Container>
        </Col>
      </Row>
      <EnableAccountModal
        show={showEnableModal}
        onHide={handleModalXButtonClick}
        email={credentials.email}
        disabled={false}
        modalClass={"enable-account-modal"}
        setEnableResult={setEnableResult}
      />
      <ConfirmResultModal
        show={showConfirmModal}
        closer={() => setShowConfirmModal(false)}
        switchLabel={switchLabel}
        dialogClass="email-sent-modal"
        expireTime={expireTime}
      />
    </Container>
  );
};

export default Login;
