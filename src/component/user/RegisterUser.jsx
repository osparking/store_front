import React, { useState } from 'react';
import BsAlertHook from '../hook/BsAlertHook';

const RegisterUser = () => {
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
    usable: "",
    password: "",
    userType: "",
    dept: "",
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

  return <div>유저 등록 정보 입력 폼</div>;
};

export default RegisterUser
