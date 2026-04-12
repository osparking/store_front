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
          <Container fluid style={{ marginTop: "-6px" }}>
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                height: "fit-content",
              }}
            >
              <Row style={{ minWidth: "790px", flexWrap: "nowrap" }}>
                <Col xs={5} md={5}>
                  <h6>
                    ©{new Date().getFullYear()} 범이비누 - All rights reserved.
                  </h6>
                </Col>
                <Col xs={4} md={4}>
                  <h6>이메일 - jbpark03@gmail.com</h6>
                </Col>
                <Col xs={3} md={3}>
                  <h6>휴대폰 - (010) 2899-9168</h6>
                </Col>
              </Row>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
}

export default Footer;
