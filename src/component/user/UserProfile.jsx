import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import EmpImage from "../common/EmpImage";
import ImageUp from "../modal/ImageUp";
import { Link } from "react-router-dom";

const UserProfile = ({ user }) => {
  const [showImageUp, setShowImageUp] = useState(false);

  return (
    <Container>
      <React.Fragment>
        <Row>
          <Col md={3} xs={6}>
            <Card>
              <Card.Body>
                <EmpImage empPhoto={user.photoBytes} />
              </Card.Body>
              <div>
                <p>
                  <Link to={"#"} onClick={() => setShowImageUp(true)}>
                    사진 변경
                  </Link>
                </p>
                <ImageUp
                  user={user}
                  show={showImageUp}
                  handleClose={() => setShowImageUp(false)}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
