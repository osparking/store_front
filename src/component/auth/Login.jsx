import React, { useState } from "react";
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsPersonFill } from "react-icons/bs";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setCreden({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col sm={6}>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">
                <Form>
                  <Form.Label>이메일</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <BsPersonFill />
                    </InputGroup.Text>
                  </InputGroup>
                </Form>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
