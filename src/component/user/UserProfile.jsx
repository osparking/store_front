import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import EmpImage from "../common/EmpImage";
import ChangePassword from "../modal/ChangePassword";
import ImageUp from "../modal/ImageUp";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { deleteUserAccount } from "./UserService";
import { logoutUser } from "../auth/AuthService";

const UserProfile = ({ user, handleRemovePhoto }) => {
  const [showImageUp, setShowImageUp] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const userRoles = localStorage.getItem("userRoles") || [];
  const loginId = localStorage.getItem("loginId");
  const fromList = (loginId !== user.id);

  const handleCloseAccountButtonCLick = () => {    
    setShowDelModal(true);
  }  

  const [showDelModal, setShowDelModal] = useState(false);
  const handleModalXButtonClick = () => {
    setShowDelModal(false);
    setUserToDel(null);
  };

  const handleDeleteOrder = async () => {
    try {
      await deleteUserAccount(user.id);
      setShowDelModal(false);
      logoutUser();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        handleDeletion={handleDeleteOrder}
        target={`${user.fullName}`}
        deleting={false}
      />      
      <React.Fragment>
        <Row>
          <Col md={3} xs={6}>
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <div>
                  {!userRoles.includes("ROLE_CUSTOMER") && (
                    <>
                      <EmpImage empPhoto={user.photoBytes} />
                      <p className="mt-5">
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
                    </>)
                  }
                  <Link to={"#"} onClick={() => setShowChangePassword(true)}>
                    비밀번호 변경
                  </Link>
                  <ChangePassword
                    userId={user.id}
                    show={showChangePassword}
                    handleClose={() => setShowChangePassword(false)}
                  />
                </div>
              </Card.Body>
              <Card.Body>
                <div className="d-flex justify-content-center mt-2 mb-2">
                  <div className="mx-2">
                    <Link
                      to={`/user/${user.id}/update`}
                      className="btn btn-warning btn-sm"
                    >
                      프로필 수정
                    </Link>
                  </div>
                  <div className="mx-2">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCloseAccountButtonCLick}
                    >
                      계정 폐쇄
                    </Button>
                  </div>
                </div>
              </Card.Body>
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
                  <Card.Text>{user.enabled ? "가능" : "불가능"}</Card.Text>
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>등록 일시 : </Col>
                <Col md={7}>
                  <Card.Text>{user.addDate}</Card.Text>
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
        {fromList && (
          <Row>
            <div className="returnLink">
              <Link to="/dashboard/admin">목록</Link>
            </div>
          </Row>)}
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
