import React, { useState } from "react";
import { Card, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { BsLockFill, BsPersonFill } from "react-icons/bs";

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
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="(이메일)"
                      value={credentials.email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  <Form.Group className="mb-3" controlId="password">
                    <Form.Label>비밀번호</Form.Label>
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
