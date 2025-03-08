import React, { useState } from "react";
import { Card, Col, Container, Form, Row } from "react-bootstrap";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setCreden({ ...credentials, [e.target.name]: e.target.value });
  };
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>
                <Form></Form>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
