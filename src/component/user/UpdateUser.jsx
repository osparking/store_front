import React, { useEffect, useId, useState } from 'react'
import BsAlertHook from '../hook/BsAlertHook';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import WorkerDeptSelector from '../worker/WorkerDeptSelector';
import { getUserById, getUserDtoById, updateUser } from './UserService';
import ProcessSpinner from '../common/ProcessSpinner';
import AlertMessage from '../common/AlertMessage';

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

  const { userId } = useParams();
  const loginId = localStorage.getItem("loginId");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (userId === loginId) {
          console.log("나의 정보 갱신");
          const result = await getUserDtoById(userId);
          setUser(result.data);
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
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
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
      enabled: user.enabled
    };

    try {
      console.log("updated user: ", updateUser);
      setIsProcessing(true);
      const response = await updateUser(userId, updatedUser);
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
    // const loginId = localStorage.getItem("loginId");
    if (userId === loginId) {
      navigate(`/dashboard/${loginId}/user`);
    } else {
      navigate(`/dashboard/admin`);
    }
  };

  return (
    <Container md={6} className="d-flex justify-content-center mt-5">
      <Col md={6}>
        <Form className="mb-5" onSubmit={handleUpdate}>
          <Card className="shadow">
            <Card.Header className="text-center mb-2 h3">
              정보 수정
            </Card.Header>
            <Card.Body className="mb-3">
              <Row>
                <Col>
                  <Form.Label className="legend">성명</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="(성명)"
                    value={user.fullName}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col>
                  <Form.Label className="legend">계정 상태</Form.Label>
                  <Form.Check
                    type="switch"
                    name="enabled"
                    checked={user.enabled}
                    onChange={handleCheckChange}
                    label="활성화"
                  />
                </Col>
              </Row>

              {/* 연락처 두 가지 */}
              <fieldset className="field-set mb-2 mt-2">
                <Row>
                  <Col>
                    <Form.Label className="legend">이메일</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="(이메일)"
                      value={user.email}
                      disabled
                    />
                  </Col>
                  <Col>
                    <Form.Label className="legend">휴대폰</Form.Label>
                    <Form.Control
                      type="text"
                      name="mbPhone"
                      placeholder="(휴대폰 번호)"
                      value={user.mbPhone}
                      onChange={handleInputChange}
                    />
                  </Col>
                </Row>
              </fieldset>

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

              {user.userType === "노동자" && (
                <fieldset className="field-set mb-2 mt-2">
                  <Row>
                    <Col>
                      <Form.Label className="legend">소속 부서</Form.Label>
                      <WorkerDeptSelector
                        workerDept={user.dept}
                        onChange={handleInputChange}
                      />
                    </Col>
                    <Col >
                      <Form.Label className='legend' >사진 유무: </Form.Label>
                      <Form.Control
                        className='ms-0'
                        type="text"
                        name="photoYN"
                        value={`${user.photoId ? "유" : "무"}`}
                        disabled
                      /></Col>
                  </Row>
                </fieldset>)}
              <Form.Group as={Col} controlId="addDate" className="mb-2">
                <Form.Label>등록 일시</Form.Label>
                <Form.Control
                  type="text"
                  name="addDate"
                  value={user.addDate}
                  disabled
                />
              </Form.Group>

              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}
              {alertSuccess && (
                <AlertMessage type={"success"} message={successMsg} />
              )}

              <div className="d-flex justify-content-center">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={cancelUpdate}
                  >
                    닫기
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
}

export default UserUpdate