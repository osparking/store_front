import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { Button, Card, Row, Table } from "react-bootstrap";
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

  const getClasses = (flag) => {
    return flag ? "setBorder ms-1 text-start" : "text-start ms-1";
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

  const isUpdatable = (label) => {
    if (label === "성명" || label === "휴대폰" || label === "소속 부서") {
      return true;
    }
    return false;
  };

  const PasswordCard = () => {
    return (
      <Card
        id="passwordCard"
        className="text-center mb-3 shadow"
        style={{ height: "fit-content" }}
      >
        <Card.Body className="p-3">
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
            <p id="changePasswordLink">
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
          </div>
        </Card.Body>
      </Card>
    );
  };

  const UserInfoCard = () => {
    return (
      <Card id="userInfoCard" className="profileItems">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="userProfile" className="my-0">
              <tbody>
                <tr id="legendRow">
                  <td className="text-end">
                    <Link
                      to={`/user/${user.id}/update`}
                      className="btn btn-warning btn-sm w-70 py-0"
                      style={{
                        fontWeight: "bold",
                        minWidth: "60px",
                        maxWidth: "fit-content",
                        borderWidth: "4px",
                        borderStyle: "solid",
                        borderColor: "#ffc107",
                      }}
                    >
                      정보 수정
                    </Link>
                  </td>
                  <td id="legendBlock" className="setBorder">
                    &nbsp;
                  </td>
                  <td className="text-start">: 수정 가능</td>
                </tr>

                {profileData.map((item, index) => (
                  <tr key={index}>
                    <td
                      md={4}
                      className="text-end"
                      style={{ minWidth: "145px" }}
                    >
                      {item.label}:
                    </td>
                    <td
                      md={7}
                      colSpan={2}
                      className={getClasses(isUpdatable(item.label))}
                      //  ? "setBorder ms-1 text-start" : "text-start ms-1"}`}
                      style={{ minWidth: "250px" }}
                    >
                      {item.value}
                    </td>
                  </tr>
                ))}

                <tr>
                  <td md={4} className="text-end" style={{ minWidth: "145px" }}>
                    구글 이중 인증(2FA):
                  </td>
                  <td md={7} colSpan={2} className="setBorder">
                    <div id="switch-2FA">
                      <Switch
                        disabled={switchDisabled}
                        checked={twoFaEnabled}
                        onChange={twoFaEnabled ? disable2FA : enable2FA}
                        slotProps={{
                          input: {
                            "aria-label": "이중 인증 활성화 상태 토글",
                          },
                        }}
                      />
                      <span
                        style={{
                          fontWeight: "bolder",
                          fontSize: ".9rem",
                          fontStretch: "expanded",
                          color: `${twoFaEnabled ? "green" : "slategrey"}`,
                        }}
                      >
                        {twoFaEnabled ? "활성화됨" : "비활성됨"}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        handleDeletion={handleDeleteOrder}
        target={`${user.fullName} 계정의`}
        deleting={false}
      />
      <div style={{ width: "100%", maxWidth: "90vw", margin: "0 auto" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid size={{ xs: 12, sm: 12, md: 3, lg: 3 }}>{PasswordCard()}</Grid>
          <Grid size={{ xs: 12, sm: 12, md: 9, lg: 9 }}>
            {UserInfoCard()}
            {showQrCode && (
              <QRcodeBox
                qrCodeUrl={qrCodeUrl}
                setTwoFaEnabled={setTwoFaEnabled}
                setShowQrCode={setShowQrCode}
              />
            )}
          </Grid>
        </Grid>
      </div>
      {fromList && isAdmin && (
        <Row>
          <div className="returnLink">
            <Link to="/dashboard/admin">목록</Link>
          </div>
        </Row>
      )}
    </>
  );
};

export default UserProfile;
