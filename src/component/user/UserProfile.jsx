import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import { useState } from "react";
import { Button, Card, Form, Row, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import QRcodeBox from "../auth/QRcodeBox";
import EmpImage from "../common/EmpImage";
import ChangePassword from "../modal/ChangePassword";
import ConfirmationModal from "../modal/ConfirmationModal";
import DisableAccountModal from "../modal/DisableAccountModal";
import ImageUp from "../modal/ImageUp";
import { callWithToken } from "../util/api";
import "./UserProfile.css";
import { deleteUserPhoto } from "../modal/ImageService";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import BsAlertHook from "../hook/BsAlertHook";

const UserProfile = ({ user }) => {
  const userNew = { ...user, enabled: user.enabled ? "가능" : "불가능" };
  const [showImageUp, setShowImageUp] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);

  const loginId = localStorage.getItem("LOGIN_ID");
  const fromList = Number(loginId) !== user.id;
  const isAdmin = JSON.parse(localStorage.getItem("IS_ADMIN"));

  const handleCloseAccountButtonCLick = () => {
    setShowDelModal(true);
  };

  const [show2FA_modal, setShow2FA_modal] = useState(false);
  const [showDelModal, setShowDelModal] = useState(false);
  const handleModalXButtonClick = () => {
    setShowDelModal(false);
  };

  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const [showPhotoDelModal, setShowPhotoDelModal] = useState(false);
  const [delPhotoBtnDisabled, setDelPhotoBtnDisabled] = useState(false);

  const removePhoto = async () => {
    try {
      setDelPhotoBtnDisabled(true);
      const result = await deleteUserPhoto(user.id);
      window.location.reload();
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    } finally {
      setDelPhotoBtnDisabled(false);
    }
  };

  const confirmPhotoRemoval = () => {
    setShowPhotoDelModal(true);
  };

  const [twoFaEnabled, setTwoFaEnabled] = useState(user.twoFaEnabled);

  const enable2FA = async () => {
    if (showQrCode) {
      setShowQrCode(false);
      return;
    }

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
      setShow2FA_modal(false);
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
                    {user.photoBytes ? "사진 변경" : "사진 등록"}
                  </Link>
                </p>
                <p>
                  <Link
                    to={"#"}
                    {...(user.photoId
                      ? { onClick: confirmPhotoRemoval }
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
        <DeleteConfirmModal
          show={showPhotoDelModal}
          onHide={() => setShowPhotoDelModal(false)}
          handleDeletion={removePhoto}
          target={"프로필 사진"}
          disabled={delPhotoBtnDisabled}
          modalClass="delete-photo-confirm"
        />
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
                      id="profileChangeLink"
                      to={`/user/${user.id}/update`}
                      className="btn btn-warning btn-sm w-70 py-0"
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
                  <td md={7} colSpan={2}>
                    <div id="switch-2FA">
                      <Switch
                        id="twoFAswitch"
                        disabled={switchDisabled}
                        checked={twoFaEnabled}
                        onChange={
                          twoFaEnabled
                            ? () => setShow2FA_modal(true)
                            : enable2FA
                        }
                        slotProps={{
                          input: {
                            "aria-label": "이중 인증 활성화 상태 토글",
                          },
                        }}
                      />
                      <Form.Label htmlFor="twoFAswitch">
                        <span
                          className="serif"
                          style={{
                            fontWeight: "bolder",
                            fontSize: ".9rem",
                            fontStretch: "expanded",
                            color: `${twoFaEnabled ? "darkgreen" : "slategrey"}`,
                          }}
                        >
                          {twoFaEnabled ? "활성화됨" : "비활성임"}
                        </span>
                      </Form.Label>
                    </div>
                    {showQrCode && (
                      <QRcodeBox
                        qrCodeUrl={qrCodeUrl}
                        setTwoFaEnabled={setTwoFaEnabled}
                        setShowQrCode={setShowQrCode}
                      />
                    )}
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
      <DisableAccountModal
        show={showDelModal}
        onHide={handleModalXButtonClick}
        userId={loginId}
        target={`${user.fullName} 계정`}
        disabled={false}
        modalClass={"disable-account-confirm"}
      />
      <ConfirmationModal
        show={show2FA_modal}
        handleClose={() => setShow2FA_modal(false)}
        handleConfirm={disable2FA}
        bodyMessage="구글 이중 인증을 생략할까요?"
        title="구글 이중 인증"
        noLabel="인증 유지"
        yesLabel="인증 생략"
        headerBgColor="bg-warning"
        modelClassName="twoFAmodal"
      />
      <div style={{ width: "100%", maxWidth: "90vw", margin: "0 auto" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, md: 2 }}>
          <Grid size={{ xs: 12, md: 3 }}>{PasswordCard()}</Grid>
          <Grid size={{ xs: 12, md: 9 }}>{UserInfoCard()}</Grid>
        </Grid>
      </div>
      {fromList && isAdmin && (
        <Row>
          <div className="returnLink">
            <Link className="text-white" to="/dashboard/admin">
              프로필 목록
            </Link>
          </div>
        </Row>
      )}
    </>
  );
};

export default UserProfile;
