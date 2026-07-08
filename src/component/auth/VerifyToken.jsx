import React, { useEffect, useState } from "react";
import ProcessSpinner from "../common/ProcessSpinner";
import { verify_token } from "./AuthService";
import { storeJWT } from "../util/utilities";
import PasswordResetModal from "../modal/PasswordResetModal";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyToken = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("토큰 검증 중입니다...");
  const [alertType, setAlertType] = useState("alert-info");
  const [tokenExpired, setTokenExpired] = useState(false);
  const [email, setEmail] = useState("");
  const [switchLabel, setSwitchLabel] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const callVerifyToken = async (token) => {
    setIsProcessing(true);
    try {
      const response = await verify_token(token);
      setSwitchLabel(response.message);

      const jwtToken = response.data.token;
      storeJWT(jwtToken, false);
    } catch (error) {
      if (error.response) {
        const message = error.response.data.message;
        setEmail(error.response.data.data);
        setAlertType("alert-danger");

        if (message === "만료된 토큰") {
          setErrorMsg("비밀번호 리셋 토큰이 만료되었습니다.");
          setAlertType("alert-warning");
          setTokenExpired(true);
        } else if (message === "폐기된 토큰") {
          setErrorMsg("이미 사용된 비밀번호 리셋 토큰입니다.");
          setAlertType("alert-warning");
        } else if (message === "잘못된 토큰") {
          setErrorMsg("비밀번호 리셋 토큰 오류입니다.");
          setAlertType("alert-warning");
        } else {
          setErrorMsg(message);
        }
      } else {
        // setErrorMsg("서버 연결 오류가 발생하였습니다.");
        setErrorMsg(JSON.stringify(error));
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (errorMsg) {
      navigate("/login", { state: { prevError: errorMsg } });
    }
  }, [errorMsg]);

  const tokenVerifinRequested = React.useRef(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");

    if (token) {
      if (!tokenVerifinRequested.current) {
        tokenVerifinRequested.current = true;
        callVerifyToken(token);
      }
    } else if (!token) {
      setVerifyMsg("토큰이 제출되지 않았습니다.");
      setAlertType("alert-danger");
    }
  }, []);

  const [showPasswordModal, setShowPasswordModal] = useState(true);
  const moveToLoginPage = () => {
    setShowPasswordModal(false);
    window.location.href = "/login";
  };
  const [pwds, setPwds] = useState({
    newPwd: "",
    cnfPwd: "",
  });

  const handleSubmit = () => {
    let resetSuccess = true;

    // 후단에 비밀번호 갱신을 요구한다.

    navigate("/login", {
      state: resetSuccess
        ? { prevSuccess: "비밀번호가 재 설정되었습니다." }
        : { prevError: "비밀번호 재 설정 오류입니다." },
    });
  };

  return (
    <>
      <PasswordResetModal
        show={showPasswordModal && switchLabel !== ""}
        closer={() => moveToLoginPage()}
        switchLabel={switchLabel}
        doSubmit={handleSubmit}
        pwds={pwds}
        setPwds={setPwds}
      />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        {isProcessing && <ProcessSpinner message="토큰 검증" />}
      </div>
    </>
  );
};

export default VerifyToken;
