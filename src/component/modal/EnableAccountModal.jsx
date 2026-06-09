import { Button, Modal } from "react-bootstrap";
import { logoutUser } from "../auth/AuthService";
import { disableUserAccount } from "../user/UserService";
import { enableAccount } from "../user/UserService";

const EnableAccountModal = ({
  show,
  onHide,
  email,
  disabled,
  modalClass = "",
  setEnableResult,
}) => {
  const handleEnableAccount = async () => {
    try {
      const result = await enableAccount({ email: email });
      setEnableResult({
        message: result.message,
        expireTime: result.data.tokenExpireTime,
      });
      onHide();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName={modalClass}>
      <Modal.Header closeButton>
        <Modal.Title>활성화 필요 계정</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        현재 {email} 계정은 폐쇄된 상태이므로, 로그인하려면, <br />
        활성화를 요청하고, 이메일을 확인하십시오.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          활성화 취소
        </Button>
        <Button
          variant="success"
          onClick={handleEnableAccount}
          disabled={disabled}
        >
          {disabled ? "활성화 중~" : "활성화 요청"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnableAccountModal;
