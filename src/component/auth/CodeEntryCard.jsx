import { useState } from "react";
import { Button, Card, Form, InputGroup } from "react-bootstrap";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { api } from "../util/api";
import { storeLoginInfo } from "../util/utilities";

const CodeEntryCard = ({ setCodeNeeded, jwtToken, user, clearLoginForm }) => {
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
      clearLoginForm();
      navigate(`/dashboard/${user.id}/user`);      
    } catch (error) {
      console.error(error);
      toast.error("구글 코드 검증 오류!");
    } finally {
      setVerifying(false);
    }
  };

  const changeCode = (e) => {
    const intValue = e.target.value.replace(/[^0-9]/g, '');    
    setCode(intValue);  
  };

return (
  <Card>
    {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
    <Card.Body>
      <Card.Title className="text-center mb-4">구글 인증기 코드</Card.Title>
      <Form onSubmit={submitCode}>
        <Form.Label>휴대폰 앱에 표시된 코드를 입력하세요</Form.Label>
        <InputGroup>
          <InputGroup.Text>인증 코드</InputGroup.Text>
          <Form.Control
            type="number"
            name="code"
            placeholder="123456"
            value={code}
            required
            onChange={changeCode}
          />
        </InputGroup>
        <Button
          disabled={verifying}
          variant="outline-primary"
          type="submit"
          className="w-100 mt-3"
        >
          {verifying ? <span>검증 중...</span> : "인증 코드 제출"}
        </Button>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="outline-primary"
            className="w-60 mt-5"
            onClick={() => {
              setCodeNeeded(false);
            }}
          >
            로그인 페이지로...
          </Button>
        </div>
      </Form>
    </Card.Body>
  </Card>
);
};

export default CodeEntryCard;
