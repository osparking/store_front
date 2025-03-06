import React, { useState } from 'react';
import BsAlertHook from '../hook/BsAlertHook';
import { registerUser } from './UserService';
import AlertMessage from '../common/AlertMessage';

const RegisterUser = () => {
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
    usable: "",
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
    try {
      setIsProcessing(true);
      const response = await registerUser(user);
      console.log("response: ", response);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    } finally {
      setIsProcessing(false);
    }
  }

  const handleReset = () => {
    setUser({
      fullName: "",
      mbPhone: "",
      email: "",
      usable: "",
      password: "",
      userType: "",
      dept: "",
    });
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header className="text-center">사용자 등록</Card.Header>
              <Card.Body>
                <Form.Group as={Row} controlId="full-name" className="mb-3">
                  <Col xs={6} className="mb-2 mb-sm-0">
                    <Form.Label>성명</Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="(성명)"
                      value={user.lastName}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Form.Group>

                <fieldset>
                  <legend>연락처</legend>
                  <Row>
                    <Col xs={6} className="mb-2 mb-sm-0">
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
                        name="mobile"
                        placeholder="(휴대폰 번호)"
                        value={user.mbPhone}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Row>
                </fieldset>

                <Form.Group as={Row} controlId="password" className="mb-3">
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

                <Form.Group as={Row} controlId="user-type" className="mb-3">
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
                      <option value="고객">고객</option>
                      <option value="직원">직원</option>
                    </Form.Control>
                  </Col>
                </Form.Group>

                {user.userType === "직원" && (
                  <Form.Group>
                    <Row>
                      <Col>{/* 직원 소속 선택자 */}</Col>
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
                {alertSuccess && (
                  <AlertMessage type="success" message={successMsg} />
                )}
                {alertError && (
                  <AlertMessage type="danger" message={errorMsg} />
                )}
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser
