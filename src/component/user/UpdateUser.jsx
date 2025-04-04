import React, { useEffect, useState } from 'react'
import BsAlertHook from '../hook/BsAlertHook';
import { useParams } from 'react-router-dom';
import { Card, Col, Container, Form, Row } from 'react-bootstrap';

const UserUpdate = () => {
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

  const { userId } = useParams();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await getUserById(userId);
        setUser(result.data);
      } catch (error) {
        setErrorMsg(error.response.data.message);
        setShowErrorAlert(true);
      }
    };
    getUser();
  }, [userId]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  return (
    <Container md={6} className="d-flex justify-content-center mt-5">
      <Col md={6}>
        <Form className="mb-5">
          <Card className="shadow">
            <Card.Header className="text-center mb-2">
              유저 정보 갱신
            </Card.Header>
            <Card.Body className="mb-3">
              <Form.Group as={Row} controlId="fullName" className="mb-3">
                <Form.Label>성명</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="(성명)"
                  value={user.fullName}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Form>
      </Col>
    </Container>
  );
}

export default UserUpdate