import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import EmpImage from "../common/EmpImage";
import ImageUp from "../modal/ImageUp";

const UserProfile = ({ user }) => {
  const [showImageUp, setShowImageUp] = useState(false);

  const handleShowImageUp = () => setShowImageUp(true);
  const handleCloseImageUp = () => setShowImageUp(false);

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
                <ImageUp user={user} />
              </div>
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
