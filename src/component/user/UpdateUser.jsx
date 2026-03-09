import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ProcessSpinner from "../common/ProcessSpinner";
import BsAlertHook from "../hook/BsAlertHook";
import WorkerDeptSelector from "../worker/WorkerDeptSelector";
import "./UpdateUser.css";
import { getUserDtoById, updateUser } from "./UserService";
import { insertHyphens } from "../util/utilities";

const UserUpdate = () => {
  const location = useLocation();
  const [user, setUser] = useState({
    userType: "",
    fullName: "",
    mbPhone: "",
    email: "",
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

  const { id } = useParams();
  const loginId = localStorage.getItem("LOGIN_ID");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (id === loginId) {
          console.log("나의 정보 갱신");
          const result = await getUserDtoById(id);
          if (result) {
            setUser(result.data);
          } else {
            navigate("/login");
          }
        } else if (location.state) {
          console.log("남 정보 갱신");
          const { userState } = location.state;
          setUser(userState);
        }
      } catch (error) {
        const errMsg = error.response.data.error;
        setErrorMsg(errMsg === "Bad Request" ? "잘못된 요청" : errMsg);
        setAlertError(true);
      }
    };
    getUser();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const cleaned = value.replace(/\D/g, "");
    let phoneNumber = undefined;

    if (cleaned.length <= 3) {
      phoneNumber = cleaned;
    } else if (cleaned.length <= 7) {
      phoneNumber = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;
    } else {
      phoneNumber = insertHyphens(cleaned);
    }
    setUser((prevState) => ({ ...prevState, [name]: phoneNumber }));
  };

  const handleCheckChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.checked });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log(user);
    const updatedUser = {
      userType: user.userType,
      fullName: user.fullName,
      mbPhone: user.mbPhone,
      dept: user.dept,
      enabled: user.enabled,
    };

    try {
      setIsProcessing(true);
      const response = await updateUser(id, updatedUser);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const navigate = useNavigate();
  const cancelUpdate = () => {
    if (id === loginId) {
      navigate(`/dashboard/${loginId}/user`);
    } else {
      navigate(`/dashboard/admin`);
    }
  };

  return (
    <Container className="d-flex justify-content-center">
      <Form
        className="mb-5"
        onSubmit={handleUpdate}
        style={{ marginTop: "88px" }}
      >
        <Card className="shadow" style={{ maxWidth: "580px" }}>
          <Card.Header className="text-center mb-2 h3">
            성명/휴대폰 수정
          </Card.Header>
          <Card.Body>
            <Row>
              <Col
                xs={12}
                md={6}
                lg={6}
                style={{ maxWidth: "60%", minWidth: "150px" }}
              >
                <Form.Label className="legend">성명</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="(성명)"
                  value={user.fullName}
                  onChange={handleInputChange}
                  style={{ backgroundColor: "pink" }}
                />
              </Col>
              <Col xs={12} md={6} lg={6}>
                <Form.Label className="legend">계정 상태</Form.Label>
                <Form.Check
                  type="switch"
                  name="enabled"
                  checked={user.enabled}
                  onChange={handleCheckChange}
                  label="활성화"
                  style={{ marginTop: "5px" }}
                />
              </Col>
            </Row>

            {/* 연락처 두 가지 */}
            <fieldset className="field-set mb-2 mt-2">
              <Row>
                <Col xs={12} md={6} lg={6}>
                  <Form.Label className="legend">이메일</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="(이메일)"
                    value={user.email}
                    disabled
                    className="email-field"
                  />
                </Col>
                <Col
                  xs={6}
                  md={6}
                  lg={6}
                  style={{ maxWidth: "60%", minWidth: "150px" }}
                >
                  <Form.Label className="legend">휴대폰</Form.Label>
                  <OverlayTrigger overlay={<Tooltip>숫자만 :-)</Tooltip>}>
                    <Form.Control
                      type="text"
                      name="mbPhone"
                      placeholder="(휴대폰 번호)"
                      value={user.mbPhone}
                      onChange={handleInputChange}
                      style={{ backgroundColor: "pink" }}
                    />
                  </OverlayTrigger>
                </Col>
              </Row>
            </fieldset>

            <Row>
              <Col xs={5} md={5} lg={5}>
                {/* 계정 유형 - 비활성 */}
                <Form.Group as={Col} controlId="user-type" className="mb-2">
                  <Form.Label>계정 유형</Form.Label>
                  <Form.Control
                    type="text"
                    name="userType"
                    value={user.userType}
                    disabled
                  />
                </Form.Group>
              </Col>
              <Col xs={12} md={7} lg={7}>
                <Form.Group
                  controlId="addDate"
                  className="mb-2 d-flex flex-column"
                >
                  <Form.Label>등록 일시</Form.Label>
                  <Form.Control
                    type="text"
                    name="addDate"
                    value={user.addDate}
                    disabled
                    style={{ minWidth: "262px" }}
                  />
                </Form.Group>
              </Col>
            </Row>
            {user.userType === "노동자" && (
              <fieldset className="field-set mb-2 mt-2">
                <Row>
                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    style={{ width: "50%", minWidth: "150px" }}
                  >
                    <Form.Label className="legend">소속 부서</Form.Label>
                    <WorkerDeptSelector
                      workerDept={user.dept}
                      onChange={handleInputChange}
                    />
                  </Col>
                  <Col
                    xs={12}
                    md={6}
                    lg={6}
                    style={{ width: "50%", minWidth: "150px" }}
                  >
                    <Form.Label className="legend">사진 유무: </Form.Label>
                    <Form.Control
                      className="ms-0"
                      type="text"
                      name="photoYN"
                      value={`${user.photoId ? "유" : "무"}`}
                      disabled
                    />
                  </Col>
                </Row>
              </fieldset>
            )}

            {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
            {alertSuccess && (
              <AlertMessage type={"success"} message={successMsg} />
            )}

            <div className="d-flex justify-content-center char2button mt-4">
              <div className="mx-2">
                <Button
                  type="submit"
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <ProcessSpinner message="갱신 처리 중..." />
                  ) : (
                    "갱신"
                  )}
                </Button>
              </div>
              <div className="mx-2">
                <Button variant="secondary" size="sm" onClick={cancelUpdate}>
                  닫기
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Form>
    </Container>
  );
};

export default UserUpdate;
