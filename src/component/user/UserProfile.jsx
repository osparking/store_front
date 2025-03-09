import React, { useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import EmpImage from "../common/EmpImage";
import ImageUp from "../modal/ImageUp";

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
                      : { style: { cursor: "default", color: "grey" } })}
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
          <Col md={8}>
            <Card>
              <Card.Body className="d-flex align-items-center">
                <Col md={4}>성명 : </Col>
                <Col md={4}>
                  <Card.Text>{user.fullName}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>휴대폰 : </Col>
                <Col md={4}>
                  <Card.Text>{user.mbPhone}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>이메일 : </Col>
                <Col md={4}>
                  <Card.Text>{user.email}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>로그인 가능성 : </Col>
                <Col md={4}>
                  <Card.Text>{user.usable ? "가능" : "불가능"}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>등록 일시 : </Col>
                <Col md={7}>
                  <Card.Text>{user.regDateTime}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>유저 구분 : </Col>
                <Col md={4}>
                  <Card.Text>{user.userType}</Card.Text>
                </Col>
              </Card.Body>

              {user.userType === "노동자" && (
                <Card.Body className="d-flex align-items-center">
                  <Col md={4}>소속 부서 : </Col>
                  <Col md={4}>
                    <Card.Text>{user.dept}</Card.Text>
                  </Col>
                </Card.Body>
              )}
            </Card>
          </Col>
        </Row>
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
