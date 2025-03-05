import React, { useState } from 'react';
import BsAlertHook from '../hook/BsAlertHook';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await RegisterUser(user);
      console.log("response: ", response);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
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
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser
