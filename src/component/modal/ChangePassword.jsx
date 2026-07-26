import { useEffect, useState, useRef } from "react";
import {
  Button,
  Form,
  InputGroup,
  Modal,
  Overlay,
  Popover,
  Spinner,
} from "react-bootstrap";
import toast from "react-hot-toast";
import { logoutUser } from "../auth/AuthService";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { changePwd } from "../user/UserService";
import "./ConfirmationModal.css";
import { FiEye, FiEyeOff } from "react-icons/fi";
import PasswordRule from "./PasswordRule";

const ChangePassword = ({ userId, show, handleClose }) => {
  const [pwdType, setPwdType] = useState({
    current: "password",
    newPwd: "password",
    confirm: "password",
  });
  const [pwds, setPwds] = useState({
    curPwd: "",
    newPwd: "",
    cnfPwd: "",
  });
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

  const handleChange = (e) => {
    setPwds({ ...pwds, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setPwds({ curPwd: "", newPwd: "", cnfPwd: "" });
    setAlertError(false);
    setAlertSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { curPwd, newPwd, cnfPwd } = pwds;
    try {
      await changePwd(userId, curPwd, newPwd, cnfPwd);
      toast.success("재 로그인이 필요합니다.");
      logoutUser();
      handleClose();
    } catch (error) {
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  const togglePasswordStarize = (pwdName) => {
    // 현재 타입을 미리 계산 (업데이트 전 값 사용)
    const currentType = pwdType[pwdName];
    const newType = currentType === "password" ? "text" : "password";

    setPwdType({
      ...pwdType,
      [pwdName]: newType, // 동적 키 할당
    });
  };

  const [showPopover, setShowPopover] = useState(false);
  const inputRef = useRef(null);

  const handleFocus = () => setShowPopover(true);
  const handleBlur = (e) => {
    // 팝오버 내부로 포커스가 이동하면 닫지 않음
    if (e.relatedTarget && e.relatedTarget.closest(".popover")) {
      return;
    }
    setShowPopover(false);
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      dialogClassName={"change-pwd-modal"}
    >
      <Modal.Header closeButton={true}>
        <Modal.Title>비밀번호 변경</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        {alertSuccess && <AlertMessage type={"success"} message={successMsg} />}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="curPwd">
            <Form.Label>현재 비밀번호: </Form.Label>
            <InputGroup>
              <Form.Control
                type={pwdType.current}
                value={pwds.curPwd}
                placeholder="(현재 비밀번호)"
                name="curPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={() => togglePasswordStarize("current")}>
                {pwdType.current === "password" ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="newPwd" className="mb-2">
            <Form.Label>신규 비밀번호: </Form.Label>
            <Overlay
              show={showPopover}
              target={inputRef.current}
              placement="top"
              container={document.body}
            >
              <Popover id="password-rules-popover">
                <Popover.Header as="h3">작성 규칙</Popover.Header>
                <Popover.Body className="pwd-rules-body">
                  <PasswordRule />
                </Popover.Body>
              </Popover>
            </Overlay>
            <InputGroup>
              <Form.Control
                ref={inputRef}
                type={pwdType.newPwd}
                value={pwds.newPwd}
                placeholder="(신규 비밀번호)"
                name="newPwd"
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <InputGroup.Text onClick={() => togglePasswordStarize("newPwd")}>
                {pwdType.newPwd === "password" ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="cnfPwd" className="mb-2">
            <Form.Label>비밀번호 확인: </Form.Label>
            <InputGroup>
              <Form.Control
                type={pwdType.confirm}
                value={pwds.cnfPwd}
                placeholder="(비밀번호 확인)"
                name="cnfPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={() => togglePasswordStarize("confirm")}>
                {pwdType.confirm === "password" ? <FiEyeOff /> : <FiEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <div className="d-flex justify-content-center mt-4">
            <div className="mx-2">
              <Button variant="primary" size="sm" type="submit">
                비밀번호 변경
              </Button>
            </div>
            <div className="mx-2 mb-4">
              <Button variant="secondary" size="sm" onClick={handleReset}>
                리셋
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePassword;
