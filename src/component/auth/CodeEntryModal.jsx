import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { SiGoogleauthenticator } from "react-icons/si";
import { useNavigate } from "react-router-dom";
import google_authen from "../../assets/images/google_authen.svg";
import { api } from "../util/api";
import { storeLoginInfo } from "../util/utilities";

import "../../App.css";

const CodeEntryModal = ({ show, handleHide, jwtToken, user }) => {
  
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const navigate = useNavigate();

  // 구글 인증기 코드 제출 함수
  const submitCode = async (e) => {
    e.preventDefault();
    setVerifying(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      formData.append("jwtToken", jwtToken);

      console.log("submit code: " + code + ", token:" + jwtToken);
      await api.post("/autho/public/verify-2fa-login", formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      storeLoginInfo(user, jwtToken);
      window.dispatchEvent(new Event("loginEvt"));
      navigate(`/dashboard/${user.id}/user`);
    } catch (error) {
      console.error(error);
      toast.error("구글 코드 검증 오류!");
    } finally {
      setVerifying(false);
    }
  };

  const changeCode = (e) => {
    const intValue = e.target.value.replace(/[^0-9]/g, "");
    setCode(intValue);
  };

  return (
    <Modal show={show} onHide={handleHide} size="sm">
      <Modal.Header closeButton>
        <SiGoogleauthenticator /> 구글 인증기 코드
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={submitCode}>
          <Form.Label>
            <img src={google_authen} className="img-logo" alt="구글 인증기" />
            코드를 공백 없이 입력하세요
          </Form.Label>
          <InputGroup>
            <InputGroup.Text>인증기 코드</InputGroup.Text>
            <Form.Control
              type="number"
              name="code"
              placeholder="123456"
              value={code}
              required
              onChange={changeCode}
            />
          </InputGroup>
          <div className="button-centered">
            <Button
              disabled={verifying}
              variant="outline-primary"
              type="submit"
              className="w-50 mt-4"
              style={{ width: "50vw" }}
            >
              {verifying ? <span>검증 중...</span> : "코드 제출"}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="outline-primary"
              className="w-60 mt-4"
              onClick={handleHide}
            >
              창 닫기
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CodeEntryModal;
