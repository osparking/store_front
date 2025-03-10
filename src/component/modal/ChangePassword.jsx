import React, { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";
import { FiEyeOff, FiEye } from "react-icons/fi";
import AlertMessage from "../common/AlertMessage";

const ChangePassword = ({ userId, show, handleClose }) => {
  const [type, setType] = useState("password");
  const { icon, setIcon } = useState(FiEyeOff);
  const [pwds, setPwds] = useState({
    curPwd: "",
    newPwd: "",
    cnfPwd: "",
  });
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

  const handleChange = (e) => {
    setPwds({ ...pwds, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setPwds({ curPwd: "", newPwd: "", cnfPwd: "" });
    setAlertError(false);
    setAlertSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { curPwd, newPwd, cnfPwd } = pwds;
    try {
      const response = await changePwd(userId, curPwd, newPwd, cnfPwd);
      handleReset();
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  const togglePasswordStarize = () => {
    type === "password" ? setType("text") : setType("password");
    icon === FiEyeOff ? setIcon(FiEye) : setIcon(FiEyeOff);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton={true}>
        <Modal.Title>비밀번호 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {showErrorAlert && <AlertMessage type={"danger"} message={errorMsg} />}
        {showSuccessAlert && (
          <AlertMessage type={"success"} message={successMsg} />
        )}
        <Form onSubmit={handleSubmit}>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePassword;
