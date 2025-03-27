import React, {useState} from 'react'
import { verifyEmail } from './AuthService';

const EmailVerifin = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("이메일 검증 중입니다...");
  const [alertType, setAlertType] = useState("alert-info");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [email, setEmail] = useState("");

  const callVerifyEmail = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verifyEmail(token);

      switch (response.message) {
        case "계정 활성화":
          setVerifyMsg("이메일 검증이 성공하여 로그인이 가능합니다.");
          setAlertType("alert-success");
          break;
        case "이미 검증된 토큰":
          setVerifyMsg("이메일 검증이 이미 완료된 바 있습니다.");
          setAlertType("alert-info");
          break;
        default:
          setVerifyMsg("이메일 검증 중 오류가 발생하였습니다.");
          setAlertType("alert-danger");
          break;
      }
  } catch (error) {
    if (error.response) {
      const message = error.response.data.message;
      setEmail(error.response.data.data);
      setAlertType("alert-danger");
      if (message === "만료된 토큰") {
        setVerifyMsg("계정 등록 때 발급된 토큰이 만료되었습니다.");
        setAlertType("alert-warning");
        setTokenExpired(true);
      } else {
        setVerifyMsg(message);
      }
    } else {
      setVerifyMsg("서버 연결 오류가 발생하였습니다.");
    }
  } finally {
    setIsProcessing(false);
  }
  };
  return (
    <div>EmailVerifin</div>
  )
}

export default EmailVerifin