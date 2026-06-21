import Switch from "@mui/material/Switch";
import { useContext, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { ManageWorkersContext } from "../../admin/ManageWorkers";
import QRcodeBox from "../../auth/QRcodeBox";
import BsAlertHook from "../../hook/BsAlertHook";
import { RootContext } from "../../layout/RootLayout";
import ConfirmationModal from "../../modal/ConfirmationModal";
import DeleteWorkerConfirmModal from "../../modal/DeleteWorkerConfirmModal";
import { callWithToken } from "../../util/api";
import { handlePhoneChange, insertHyphens } from "../../util/utilities";
import WorkerDeptSelector from "../../worker/WorkerDeptSelector";
import "../UserProfile.css";
import { updateUser, updateWorkerDept } from "../UserService";
import "./UserDetails.css";

const UserInfoCard = ({ user, readOnly, isAdmined, handleDeletion }) => {
  console.log("user: ", user);
  const [newUser, setNewUser] = useState(user);

  const [userDept, setUserDept] = useState(user.dept);
  const [userFullName, setUserFullName] = useState(user.fullName);
  const [userMbPhone, setUserMbPhone] = useState(user.mbPhone);

  const restoreDept = () => {
    if (isAdmined) {
      setNewUser({ ...newUser, dept: userDept });
    } else {
      setNewUser({
        ...newUser,
        fullName: userFullName,
        mbPhone: userMbPhone,
      });
    }
  };

  const deptRemains = () => {
    if (isAdmined) {
      return userDept === newUser.dept;
    } else {
      return (
        userFullName === newUser.fullName && userMbPhone === newUser.mbPhone
      );
    }
  };

  const profileData = [
    {
      label: "성명",
      type: "text",
      name: "fullName",
      value: newUser.fullName,
      disabled: isAdmined,
    },
    {
      label: "휴대폰",
      type: "tel",
      name: "mbPhone",
      value: newUser.mbPhone,
      disabled: isAdmined,
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

  const disableDept = readOnly || !isAdmined;

  if (newUser.userType === "노동자") {
    profileData.push({
      label: "소속 부서",
      value: newUser.dept,
      disabled: disableDept,
    });
  }

  if (isAdmined) {
    profileData.push({
      label: "로그인",
      value: newUser.enabled ? "가능" : "불가능",
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

  const rootContext = useContext(RootContext);
  const refreshUser = rootContext.refreshUser;
  const [isProcessing, setIsProcessing] = useState(false);
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

  const [showDelModal, setShowDelModal] = useState(false);
  const [delBtnDisabled, setDelBtnDisabled] = useState(false);

  const manageWorkersContext = useContext(ManageWorkersContext);
  const readWorkerList = manageWorkersContext?.readWorkerList;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsProcessing(true);

      let response = null;
      const localUser = JSON.parse(localStorage.getItem("USER"));

      if (isAdmined) {
        response = await updateWorkerDept(newUser.id, newUser.dept);
        localUser.dept = response.data;
        localStorage.setItem("USER", JSON.stringify(localUser));
        
        setUserDept(newUser.dept);
        readWorkerList();
      } else {
        response = await updateUser(newUser.id, newUser);
        localUser.fullName = response.data.fullName;
        localUser.mbPhone = response.data.mbPhone;
        localStorage.setItem("USER", JSON.stringify(localUser));

        setUserFullName(newUser.fullName);
        setUserMbPhone(newUser.mbPhone);
        refreshUser();
      }

      toast.success(response.message);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      setErrorMsg(error.response?.data.message);
      setAlertError(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const workerDeletionConfirmed = async () => {
    try {
      setDelBtnDisabled(true);
      await handleDeletion(newUser.id);
      setShowDelModal(false);
      setNewUser({ ...newUser, deleted: true });
    } catch (err) {
      setErrorMsg(err.message);
      setAlertError(true);
    } finally {
      setDelBtnDisabled(false);
    }
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
          <span className="text-danger">{user.deleted ? "(삭제됨)" : ""}</span>
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
                      {item.label === "소속 부서" ? (
                        <WorkerDeptSelector
                          workerDept={item.value}
                          onChange={handleTextChange}
                          readOnly={disableDept}
                        />
                      ) : (
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
                      )}
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
        {!readOnly && (
          <Card.Footer className="text-center">
            <div className="d-flex justify-content-center mb-3 mt-3 char2button">
              {isAdmined && (
                <Button
                  type="button"
                  disabled={user.deleted}
                  variant="danger"
                  size="sm"
                  className="me-4"
                  onClick={() => setShowDelModal(true)}
                >
                  {"삭제"}
                </Button>
              )}
              <Button
                type="button"
                disabled={deptRemains()}
                variant="secondary"
                size="sm"
                className="me-4"
                onClick={restoreDept}
              >
                {"복원"}
              </Button>
              <Button
                type="submit"
                disabled={deptRemains()}
                variant="primary"
                size="sm"
              >
                {"저장"}
              </Button>
            </div>
            <DeleteWorkerConfirmModal
              show={showDelModal}
              onHide={() => setShowDelModal(false)}
              handleDeletion={workerDeletionConfirmed}
              target={newUser.fullName}
              disabled={newUser.deleted}
              modalClass="delete-worker-confirm"
            />
          </Card.Footer>
        )}
      </Card>
    </Form>
  );
};

export default UserInfoCard;
