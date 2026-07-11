import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import "./ConfirmationModal.css";
import "./PasswordResetModal.css";

const PasswordResetModal = ({ show, closer, doSubmit, pwds, setPwds }) => {
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

  const [typePwd, setTypePwd] = useState("password");
  const [typeCnf, setTypeCnf] = useState("password");

  const togglePasswordStarizePwd = () => {
    setTypePwd(typePwd === "password" ? "text" : "password");
  };

  const togglePasswordStarizeCnf = () => {
    setTypeCnf(typeCnf === "password" ? "text" : "password");
  };

  const handleChange = (e) => {
    setPwds({ ...pwds, [e.target.name]: e.target.value });
  };

  const handleReset = async () => {
    setPwds({ newPwd: "", cnfPwd: "" });
    setAlertError(false);
    setAlertSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    doSubmit();
    closer();
  };

  function validatePassword(password, confirm) {
    if (typeof password !== "string") return false;
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    // ! @ # $ % ^ & * ( ) - _ = +
    const hasSpecial = /[!@#\$%\^&\*\(\)\-_=\+]/.test(password);
    const onlyAllowed = /^[a-zA-Z0-9!@#$%\^&*()\-_=+]+$/.test(password);
    return (
      hasLower &&
      hasUpper &&
      hasDigit &&
      hasSpecial &&
      onlyAllowed &&
      password.length >= 9 &&
      password === confirm
    );
  }

  const [hideRule, setHideRule] = useState(true);

  const toggleRule = () => {
    setHideRule(!hideRule);
    setRuleAction(hideRule ? "숨김" : "보기");
  };

  const [ruleAction, setRuleAction] = useState("보기");

  return (
    <Modal
      show={show}
      onHide={closer}
      dialogClassName={"password-reset-modal"}
      backdrop="static" // 외부 클릭 완전 차단
      keyboard={false}
    >
      <Modal.Header closeButton={true}>
        <Modal.Title>비밀번호 재 설정</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body id="pwdRstModalBodyTop">
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          <Form.Group controlId="newPwd" className="mb-2">
            <Form.Label>비밀번호: </Form.Label>
            <InputGroup>
              <Form.Control
                type={typePwd}
                value={pwds.newPwd}
                placeholder="(비밀번호)"
                name="newPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={togglePasswordStarizePwd}>
                {typePwd === "password" ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="cnfPwd" className="mb-2">
            <Form.Label>비밀번호 확인: </Form.Label>
            <InputGroup>
              <Form.Control
                type={typeCnf}
                value={pwds.cnfPwd}
                placeholder="(비밀번호 확인)"
                name="cnfPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={togglePasswordStarizeCnf}>
                {typeCnf === "password" ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center char2button gap-4">
          <Button variant="secondary" size="sm" onClick={handleReset}>
            소거
          </Button>
          <Button
            variant="primary"
            size="sm"
            type="submit"
            disabled={!validatePassword(pwds.newPwd, pwds.cnfPwd)}
          >
            저장
          </Button>
        </Modal.Footer>
      </Form>
      <Modal.Body id="pwdRstModalBodyBottom">
        <div style={{ textAlign: "center" }}>
          <Button id="pwdRuleTitle" variant="success" onClick={toggleRule}>
            비밀번호 규칙 {ruleAction}
          </Button>
        </div>
        <ul className="pwdRule" hidden={hideRule}>
          <li id="pwdRuleTopRow">허용 문자 유형: 영대, 영소, 숫자, 특수</li>
          <ul>
            <li className="no-bullet">
              (특수)
              <span style={{ letterSpacing: "1px" }}>
                {" "}
                ! @ # $ % ^ & * ( ) - _ = +
              </span>
            </li>
          </ul>
          <li id="midBreak">문자 유형별 한 자 이상 사용</li>
          <li>허용 문자만으로 길이 9 자 이상</li>
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordResetModal;
