import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import EmpImage from "../common/EmpImage";
import ImageUp from "../modal/ImageUp";
import { Link } from "react-router-dom";

const UserProfile = ({ user, handleRemovePhoto }) => {
  const [showImageUp, setShowImageUp] = useState(false);

  return (
    <Container>
      <React.Fragment>
        <Row>
          <Col md={3} xs={6}>
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <EmpImage empPhoto={user.photoBytes} />
              </Card.Body>
              <div>
                <p>
                  <Link to={"#"} onClick={() => setShowImageUp(true)}>
                    사진 변경
                  </Link>
                </p>
                <p>
                  <Link
                    to={"#"}
                    {...(user.photoId
                      ? { onClick: handleRemovePhoto }
                      : { style: { cursor: "default", color: "grey" }})}
                  >
                    사진 제거
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
