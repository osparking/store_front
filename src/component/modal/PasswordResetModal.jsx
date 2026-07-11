import { useState } from "react";
import { Button, Form, InputGroup, Modal, Spinner } from "react-bootstrap";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import "./ConfirmationModal.css";
import "./PasswordResetModal.css";
import { validatePassword } from "../util/utilities";
import PasswordRule from "./PasswordRule";

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

  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    doSubmit().finally(() => {
      closer();
      setIsProcessing(false);
    });
  };

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
            {isProcessing ? <Spinner message="저장 중..." /> : "저장"}
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
          <PasswordRule />
        </ul>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordResetModal;
