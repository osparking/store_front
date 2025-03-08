import React, { useState } from "react";

const ImageUp = () => {
  // 1. 직원 읽기
  // 2. 원래 영상 소지 여부 검사
  // - 여: 기존 영상 갱신
  // - 부: 새로운 영상 업로드

  const [emp, setEmp] = useState(null);
  const [file, setFile] = useState(null);
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


  return <div>영상 올리기</div>;
};

export default ImageUp;
