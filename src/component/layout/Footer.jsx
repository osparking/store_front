import { Col, Container, Row } from "react-bootstrap";
import "./Footer.css";
import { useState } from "react";
import "./Footer.css";

function Footer() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="bottom-bar-container"
    >
      {isVisible && (
        <footer className="text-white bottomBar mt-auto me-0">
          <Container fluid className="px-5 ">
            <Row>
              <Col md={1}>
                <h6></h6>
              </Col>
              <Col md={4}>
                <h6>범이비누</h6>
                <p>© {new Date().getFullYear()} All rights reserved.</p>
              </Col>
              <Col md={4}>
                <h6>이메일</h6>
                <p>jbpark03@gmail.com</p>
              </Col>
              <Col md={3}>
                <h6>휴대폰</h6>
                <p>(010) 2899-9168</p>
              </Col>
            </Row>
          </Container>
        </footer>
      )}
    </div>
  );
}

export default Footer;
