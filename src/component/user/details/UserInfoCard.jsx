import Switch from "@mui/material/Switch";
import { useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import QRcodeBox from "../../auth/QRcodeBox";
import ConfirmationModal from "../../modal/ConfirmationModal";
import { callWithToken } from "../../util/api";
import { handlePhoneChange, insertHyphens } from "../../util/utilities";
import "../UserProfile.css";
import "./UserDetails.css";

const UserInfoCard = ({ user, readOnly, isAdmined }) => {
  const [newUser, setNewUser] = useState({
    ...user,
    enabled: user.enabled ? "가능" : "불가능",
  });

  const profileData = [
    {
      label: "성명",
      type: "text",
      name: "fullName",
      value: newUser.fullName,
      disabled: true,
    },
    {
      label: "휴대폰",
      type: "tel",
      name: "mbPhone",
      value: newUser.mbPhone,
      disabled: true,
    },
    { label: "이메일", value: newUser.email, disabled: true },
    { label: "등록 형태", value: newUser.signUpMethod, disabled: true },
    { label: "등록 일시", value: newUser.addDate, disabled: true },
    { label: "유저 구분", value: newUser.userType, disabled: true },
  ];

  const handleTextChange = (event) => {
    const { name, value } = event.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  if (newUser.userType === "노동자") {
    profileData.push({
      label: "소속 부서",
      value: newUser.dept,
      disabled: readOnly || !isAdmined,
    });
  }

  if (isAdmined) {
    profileData.push({
      label: "로그인",
      value: newUser.enabled,
      disabled: true,
    });
  }

  const isUpdatable = (label) => {
    if (label === "성명" || label === "휴대폰" || label === "소속 부서") {
      return true;
    }
    return false;
  };

  const getClasses = (flag) => {
    return flag && !readOnly ? "text-start ms-1" : "text-start ms-1";
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

  const setPhoneNumber = (mbPhone) => {
    setNewUser({ ...newUser, mbPhone: mbPhone });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("저장할 새 유저: ", newUser);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
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
        <Card.Header className="text-center mb-2 h5">
          계정 상세 정보
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="userProfile" className="my-0">
              <tbody>
                {!readOnly && (
                  <tr id="legendRow">
                    <td className="text-end"></td>
                    <td id="legendBlock">&nbsp;</td>
                    <td className="text-start">: 수정 가능</td>
                  </tr>
                )}

                {profileData.map((item, index) => (
                  <tr key={index}>
                    <td
                      md={4}
                      className="text-end"
                      style={{ minWidth: "145px" }}
                    >
                      <Form.Label htmlFor={item.name}>{item.label}:</Form.Label>
                    </td>
                    <td
                      md={7}
                      colSpan={2}
                      className={getClasses(isUpdatable(item.label))}
                      style={{ minWidth: "250px" }}
                    >
                      <Form.Control
                        type={item.type}
                        disabled={item.disabled}
                        id={item.name}
                        name={item.name}
                        value={
                          item.type === "tel"
                            ? insertHyphens(item.value)
                            : item.value
                        }
                        onChange={
                          item.type === "tel"
                            ? (e) => handlePhoneChange(e, setPhoneNumber)
                            : handleTextChange
                        }
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
                    <div
                      id="switch-2FA"
                      className={readOnly || isAdmined ? "greyBack" : ""}
                    >
                      <Switch
                        id="twoFAswitch"
                        disabled={switchDisabled || readOnly || isAdmined}
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
        {isAdmined && !readOnly && (
          <Card.Footer className="text-center">
            <div className="d-flex justify-content-center mb-3 mt-3 char2button">
              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="me-2"
              >
                {"저장"}
              </Button>
            </div>
          </Card.Footer>
        )}
      </Card>
    </Form>
  );
};

export default UserInfoCard;
