import Switch from "@mui/material/Switch";
import { useState } from "react";
import { Card, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import QRcodeBox from "../../auth/QRcodeBox";
import ConfirmationModal from "../../modal/ConfirmationModal";
import { callWithToken } from "../../util/api";
import { insert2Hyphens } from "../../util/utilities";
import "../UserProfile.css";
import "./UserDetails.css";

const UserInfoCard = ({ user, readOnly }) => {
  const userNew = { ...user, enabled: user.enabled ? "가능" : "불가능" };
  const profileData = [
    { label: "성명", value: userNew.fullName, disabled: false },
    {
      label: "휴대폰",
      value: insert2Hyphens(userNew.mbPhone),
      disabled: false,
    },
    { label: "이메일", value: userNew.email, disabled: true },
    { label: "등록 형태", value: userNew.signUpMethod, disabled: true },
    { label: "등록 일시", value: userNew.addDate, disabled: true },
    { label: "유저 구분", value: userNew.userType, disabled: true },
    { label: "로그인", value: userNew.enabled, disabled: true },
  ];

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setUser((prevState) => ({ ...prevState, [name]: value }));
  };

  if (userNew.userType === "노동자") {
    profileData.push({ label: "소속 부서", value: userNew.dept });
  }

  const isUpdatable = (label) => {
    if (label === "성명" || label === "휴대폰" || label === "소속 부서") {
      return true;
    }
    return false;
  };

  const getClasses = (flag) => {
    return flag && !readOnly ? "text-start ms-1 setBorder" : "text-start ms-1";
  };

  const [show2FA_modal, setShow2FA_modal] = useState(false);
  const [twoFaEnabled, setTwoFaEnabled] = useState(user.twoFaEnabled);
  const [switchDisabled, setSwitchDisabled] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");

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
      console.error("오류 - 2FA 활성화 실패, error: ", error);
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

  return (
    <Card id="userInfoCard" className="profileItems">
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
      <Card.Header className="text-center mb-2 h5">계정 상세 정보</Card.Header>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <div style={{ overflow: "auto" }}>
          <Table id="userProfile" className="my-0">
            <tbody>
              {!readOnly && (
                <tr id="legendRow">
                  <td className="text-end">
                  </td>
                  <td id="legendBlock" className="setBorder">
                    &nbsp;
                  </td>
                  <td className="text-start">: 수정 가능</td>
                </tr>
              )}

              {profileData.map((item, index) => (
                <tr key={index}>
                  <td md={4} className="text-end" style={{ minWidth: "145px" }}>
                    {item.label}:
                  </td>
                  <td
                    md={7}
                    colSpan={2}
                    className={getClasses(isUpdatable(item.label))}
                    //  ? "setBorder ms-1 text-start" : "text-start ms-1"}`}
                    style={{ minWidth: "250px" }}
                  >
                    <Form.Control
                      type="text"
                      disabled={item.disabled}
                      name="fullName"
                      placeholder="(성명)"
                      value={item.value}
                      onChange={handleTextChange}
                      className={item.disabled ? "greyBack" : ""}
                      style={{ backgroundColor: "pink" }}
                    />
                  </td>
                </tr>
              ))}

              <tr>
                <td md={4} className="text-end" style={{ minWidth: "145px" }}>
                  구글 이중 인증(2FA):
                </td>
                <td md={7} colSpan={2}>
                  <div id="switch-2FA" className={readOnly ? "greyBack" : ""}>
                    <Switch
                      id="twoFAswitch"
                      disabled={switchDisabled || readOnly}
                      checked={twoFaEnabled}
                      onChange={
                        twoFaEnabled ? () => setShow2FA_modal(true) : enable2FA
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

export default UserInfoCard;
