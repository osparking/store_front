import React, { useState } from "react";
import { useAlertTimeout } from "../util/utilities";

const BsAlertHook = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [alertSuccess, setAlertSuccess] = useAlertTimeout();

  const [errorMsg, setErrorMsg] = useState("");
  const [alertError, setAlertError] = useAlertTimeout();

  return {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  };
};

export default BsAlertHook;
