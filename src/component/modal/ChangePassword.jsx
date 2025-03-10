import React, { useState } from "react";
import { eyeOff } from "react-icons-kit/feather";
import BsAlertHook from "../hook/BsAlertHook";

const ChangePassword = ({ userId }) => {
  const [type, setType] = useState("password");
  const { icon, setIcon } = useState(eyeOff);
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

  return <div>ChangePassword</div>;
};

export default ChangePassword;
