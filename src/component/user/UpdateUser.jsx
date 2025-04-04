import React, { useState } from 'react'
import BsAlertHook from '../hook/BsAlertHook';

const UserUpdate = () => {
  const [user, setUser] = useState({
    fullName: "",
    mbPhone: "",
    email: "",
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

  return (
    <div>UserUpdate</div>
  )
}

export default UserUpdate