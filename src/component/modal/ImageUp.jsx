import React, { useState } from "react";
import BsAlertHook from "../hook/BsAlertHook";

const ImageUp = ({ user }) => {
  console.log("유저: ", user);
  // * 원래 영상 소지 여부 검사
  //   - 여: 기존 영상 갱신
  //   - 부: 새로운 영상 업로드

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
