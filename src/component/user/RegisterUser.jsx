import React, { useState } from 'react';

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

  return <div>유저 등록 정보 입력 폼</div>;
};

export default RegisterUser
