
import Switch from "@mui/material/Switch";
import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";
import EmpImage from "../common/EmpImage";
import ChangePassword from "../modal/ChangePassword";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import ImageUp from "../modal/ImageUp";
import { deleteUserAccount } from "./UserService";
import QRcodeBox from "../auth/QRcodeBox";
import { callWithToken } from "../util/api";

const UserProfile = ({ user, handleRemovePhoto }) => {
  const [showImageUp, setShowImageUp] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);

  const loginId = localStorage.getItem("LOGIN_ID");
  const fromList = loginId !== user.id;
  const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN"));
  console.log("is admin: " + isAdmin);

  const handleCloseAccountButtonCLick = () => {
    setShowDelModal(true);
  };

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

  const [twoFaEnabled, setTwoFaEnabled] = useState(user.twoFaEnabled);

  const enable2FA = async () => {
    setSwitchDisabled(true);
    try {
      const result = await callWithToken("post", "/autho/enable-2fa", user);
      console.log("QR :" + result.data);
      setQrCodeUrl(result.data);
      setShowQrCode(true);
    } catch (error) {
      console.error("오류 - 2FA 활성화 실패");
    } finally {
      setSwitchDisabled(false);
    }
  };

  const disable2FA = async () => {
    setSwitchDisabled(true);
    try {
      const result = await callWithToken("post", "/autho/disable-2fa");
      setTwoFaEnabled(false);
      setQrCodeUrl("");
    } catch (error) {
      toast.error("오류 - 2FA 비활성화 실패");
    } finally {
      setSwitchDisabled(false);
    }
  };

  return (
    <Container fluid className="home-container mt-3">
      <DeleteConfirmModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        handleDeletion={handleDeleteOrder}
        target={`${user.fullName}`}
        deleting={false}
      />
      <React.Fragment>
        <Row className="justify-content-center">
          <Col md={3} xs={6}>
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <div>
                  {!(user.userType === "고객") && (
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
                    </>
                  )}
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
                <Col md={4}>구글 이중 인증(2FA) : </Col>
                <Col md={6}>
                  <div>
                    <Switch
                      disabled={switchDisabled}
                      checked={twoFaEnabled}
                      onChange={twoFaEnabled ? disable2FA : enable2FA}
                      slotProps={{
                        input: { "aria-label": "이중 인증 활성화 상태 토글" },
                      }}
                    />
                    <span
                      style={{
                        fontWeight: "bolder",
                        color: `${twoFaEnabled ? "green" : "slategrey"}`,
                      }}
                    >
                      {twoFaEnabled ? "활성화됨" : "비활성됨"}
                    </span>
                  </div>
                  {showQrCode && (
                    <QRcodeBox
                      qrCodeUrl={qrCodeUrl}
                      setTwoFaEnabled={setTwoFaEnabled}
                      setShowQrCode={setShowQrCode}
                    />
                  )}
                </Col>
              </Card.Body>

              <Card.Body className="d-flex align-items-center">
                <Col md={4}>등록 형태 : </Col>
                <Col md={7}>
                  <Card.Text>{user.signUpMethod}</Card.Text>
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
        {(fromList && isAdmin) && (
          <Row>
            <div className="returnLink">
              <Link to="/dashboard/admin">목록</Link>
            </div>
          </Row>
        )}
      </React.Fragment>
    </Container>
  );
};

export default UserProfile;
