import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ProcessSpinner from "../common/ProcessSpinner";
import PasswordResetModal from "../modal/PasswordResetModal";
import { actResetPassword } from "../user/UserService";
import { verify_token } from "./AuthService";

const VerifyToken = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("토큰 검증 중입니다...");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState("");

  const callVerifyToken = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verify_token(token);

      setShowPasswordModal(true);
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;
        setEmail(error.response.data.data);

        if (message === "만료된 토큰") {
          setErrorMsg("만료된 비밀번호 리셋 토큰입니다.");
          setTokenExpired(true);
        } else if (message === "폐기된 토큰") {
          setErrorMsg("폐기된 비밀번호 리셋 토큰입니다.");
        } else if (message === "잘못된 토큰") {
          setErrorMsg("잘못된 비밀번호 리셋 토큰입니다.");
        } else {
          setErrorMsg(message);
        }
      } else {
        setErrorMsg("서버 연결 네트워크 오류입니다.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg) {
      navigate("/login", {
        state: {
          success: false,
          message: errorMsg,
          id: Date.now(),
        },
      });
    }
  }, [errorMsg]);

  const tokenVerifinRequested = React.useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      setToken(token);
      if (!tokenVerifinRequested.current) {
        tokenVerifinRequested.current = true;
        callVerifyToken(token);
      }
    } else if (!token) {
      setErrorMsg("토큰이 제출되지 않았습니다.");
    }
  }, []);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const moveToLoginPage = () => {
    setShowPasswordModal(false);
  };
  const [pwds, setPwds] = useState({
    newPwd: "",
    cnfPwd: "",
  });

  const handleSubmit = async () => {
    const { newPwd, cnfPwd } = pwds;
    let prevState = null;

    try {
      // 후단에 비밀번호 갱신을 요구한다.
      const result = await actResetPassword(newPwd, cnfPwd, token);

      prevState = { success: true, message: result.message, id: Date.now() };
    } catch (error) {
      prevState = {
        success: false,
        message: error.response.data.message,
        id: Date.now(),
      };
    } finally {
      navigate("/login", {
        state: prevState,
      });
    }
  };

  return (
    <>
      <PasswordResetModal
        show={showPasswordModal}
        closer={() => moveToLoginPage()}
        doSubmit={handleSubmit}
        pwds={pwds}
        setPwds={setPwds}
      />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh", color: "purple" }}
      >
        {isProcessing && <ProcessSpinner message="비밀번호 토큰 검사" />}
      </div>
    </>
  );
};

export default VerifyToken;
