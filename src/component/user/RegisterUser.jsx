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
              <Card.Header className="text-center">
                사용자 등록
              </Card.Header>
              <Card.Body></Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterUser
