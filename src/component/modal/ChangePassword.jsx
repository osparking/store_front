import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { logoutUser } from "../auth/AuthService";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { changePwd } from "../user/UserService";

const ChangePassword = ({ userId, show, handleClose }) => {
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(FiEyeOff);
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

  useEffect(() => {
    setIcon(FiEyeOff);
  }, [show]);

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

  const togglePasswordStarize = () => {
    setType(type === "password" ? "text" : "password");
    setIcon(type === "password" ? FiEye : FiEyeOff);
  };

  return (
    <Modal show={show} onHide={handleClose}>
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
                type={type}
                value={pwds.curPwd}
                placeholder="(현재 비밀번호)"
                name="curPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={togglePasswordStarize}>
                {icon}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="newPwd" className="mb-2">
            <Form.Label>신규 비밀번호: </Form.Label>
            <InputGroup>
              <Form.Control
                type={type}
                value={pwds.newPwd}
                placeholder="(신규 비밀번호)"
                name="newPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={togglePasswordStarize}>
                {icon}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>
          <Form.Group controlId="cnfPwd" className="mb-2">
            <Form.Label>비밀번호 확인: </Form.Label>
            <InputGroup>
              <Form.Control
                type={type}
                value={pwds.cnfPwd}
                placeholder="(비밀번호 확인)"
                name="cnfPwd"
                onChange={handleChange}
              />
              <InputGroup.Text onClick={togglePasswordStarize}>
                {icon}
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
