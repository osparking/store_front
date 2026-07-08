import { useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import "./ConfirmationModal.css";

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
  const [iconPwd, setIconPwd] = useState(FiEyeOff);
  const [iconCnf, setIconCnf] = useState(FiEyeOff);

  const togglePasswordStarizePwd = () => {
    setTypePwd(typePwd === "password" ? "text" : "password");
    setIconPwd(typePwd === "password" ? FiEye : FiEyeOff);
  };

  const togglePasswordStarizeCnf = () => {
    setTypeCnf(typeCnf === "password" ? "text" : "password");
    setIconCnf(typeCnf === "password" ? FiEye : FiEyeOff);
  };

  const handleChange = (e) => {
    setPwds({ ...pwds, [e.target.name]: e.target.value });
  };

  const handleReset = async (e) => {};

  const handleSubmit = (e) => {
    e.preventDefault();
    doSubmit();
    closer();
  };

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
      <Modal.Body>
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        {alertSuccess && <AlertMessage type={"success"} message={successMsg} />}
        <Form onSubmit={handleSubmit}>
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
                {iconPwd}
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
                {iconCnf}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <div
            className="d-flex justify-content-center mt-4 char2button gap-4"
            style={{ fontWeight: "500" }}
          >
            <Button variant="secondary" size="sm" onClick={handleReset}>
              리셋
            </Button>
            <Button variant="primary" size="sm" type="submit">
              저장
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default PasswordResetModal;
