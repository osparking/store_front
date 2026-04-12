import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
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
          <Container
            fluid
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div
              style={{
                overflowX: "auto",
                whiteSpace: "nowrap",
                height: "fit-content",
                scrollbarWidth: "thin",
                scrollbarColor: "#888 #f1f1f1",
                paddingBottom: "15px",
              }}
              className="custom-scrollbar"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, auto)",
                  justifyContent: "center",
                  gap: "clamp(30px, 10vw, 100px)", // Minimum 30px, grows with viewport
                  fontSize: "13px",
                  color: "#888",
                  fontWeight: "bold",
                  alignItems: "center",
                  padding: "0 20px 1px", // Optional: add padding for edges
                  minWidth: "max-content",
                }}
              >
                <span>
                  ©{new Date().getFullYear()} 범이비누 - All rights reserved
                </span>
                <span>이메일 - jbpark03@gmail.com</span>
                <span>휴대폰 - (010) 2899-9168</span>
              </div>
            </div>
          </Container>
        </footer>
      )}
    </div>
  );
}

export default Footer;
