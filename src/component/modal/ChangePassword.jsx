import React, { useState } from "react";
import { eyeOff } from "react-icons-kit/feather";
import BsAlertHook from "../hook/BsAlertHook";

const ChangePassword = () => {
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

  return <div>ChangePassword</div>;
};

export default ChangePassword;
