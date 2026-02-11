import Switch from "@mui/material/Switch";
import React, { useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { logoutUser } from "../auth/AuthService";
import QRcodeBox from "../auth/QRcodeBox";
import EmpImage from "../common/EmpImage";
import ChangePassword from "../modal/ChangePassword";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import ImageUp from "../modal/ImageUp";
import { callWithToken } from "../util/api";
import "./UserProfile.css";
import { deleteUserAccount } from "./UserService";

const UserProfile = ({ user, handleRemovePhoto }) => {
  const userNew = { ...user, enabled: user.enabled ? "가능" : "불가능" };
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

  const profileData = [
    { label: "성명", value: userNew.fullName },
    { label: "휴대폰", value: userNew.mbPhone },
    { label: "이메일", value: userNew.email },
    { label: "등록 형태", value: userNew.signUpMethod },
    { label: "등록 일시", value: userNew.addDate },
    { label: "유저 구분", value: userNew.userType },
    { label: "로그인", value: userNew.enabled },
  ];

  if (userNew.userType === "노동자") {
    profileData.push({ label: "소속 부서", value: userNew.dept });
  }

  return (
    <Container fluid className="home-container mt-5">
      <DeleteConfirmModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        handleDeletion={handleDeleteOrder}
        target={`${user.fullName} 계정의`}
        deleting={false}
      />
      <React.Fragment>
        <Row className="justify-content-center">
          <Col
            md={3}
            xs={6}
            style={{ minWidth: "200px", height: "fit-content" }}
          >
            <Card className="text-center mb-3 shadow">
              <Card.Body>
                <div className="d-flex flex-column align-items-center justify-content-center">
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
                  <p>
                    <Link to={"#"} onClick={() => setShowChangePassword(true)}>
                      비밀번호 변경
                    </Link>
                  </p>
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
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={handleCloseAccountButtonCLick}
                      className="w-100"
                      style={{ minWidth: "60px" }}
                    >
                      계정 폐쇄
                    </Button>
                  </div>
                  <div className="mx-2">
                    <Link
                      to={`/user/${user.id}/update`}
                      className="btn btn-warning btn-sm  w-100"
                      style={{ minWidth: "60px" }}
                    >
                      정보 수정
                    </Link>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8} style={{ maxWidth: "530px" }}>
            <Card
              className="profileItems mb-3"
              style={{ minWidth: "fit-content" }}
            >
              <Card.Body
                className="d-flex align-items-center"
                style={{ minWidth: "400px" }}
              >
                <Col
                  md={4}
                  className="text-end"
                  style={{ minWidth: "145px" }}
                ></Col>
                <Col
                  md={3}
                  className="setBorder ms-1"
                  style={{ minWidth: "75px" }}
                >
                  &nbsp;
                </Col>
                <Col md={4} className="ms-1">
                  (수정 가능)
                </Col>
              </Card.Body>
              {profileData.map((item, index) => (
                <Card.Body
                  key={index}
                  className="d-flex align-items-center"
                  style={{ minWidth: "400px" }}
                >
                  <Col
                    md={4}
                    className="text-end"
                    style={{ minWidth: "145px" }}
                  >
                    {item.label}:
                  </Col>
                  <Col md={7} style={{ minWidth: "250px" }}>
                    <Card.Text>&nbsp;{item.value}</Card.Text>
                  </Col>
                </Card.Body>
              ))}

              <Card.Body className="d-flex align-items-center">
                <Col md={4} className="text-end">
                  구글 이중 인증(2FA):
                </Col>
                <Col md={7}>
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
            </Card>
          </Col>
        </Row>
        {fromList && isAdmin && (
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
