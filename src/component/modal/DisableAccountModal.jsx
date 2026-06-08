import { Button, Modal } from "react-bootstrap";
import { logoutUser } from "../auth/AuthService";
import { disableUserAccount } from "../user/UserService";

const DisableAccountModal = ({
  show,
  onHide,
  userId,
  target,
  disabled,
  modalClass = "",
}) => {
  const handleDisableAccount = async () => {
    try {
      await disableUserAccount(userId);
      onHide();
      logoutUser();
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName={modalClass}>
      <Modal.Header closeButton>
        <Modal.Title>폐쇄 관련 지침</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        폐쇄 후, 귀하는 자동 로그아웃되며, <br />'{target}' 복구는 이메일 검증을
        통하여 가능합니다!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          폐쇄 취소
        </Button>
        <Button
          variant="danger"
          onClick={handleDisableAccount}
          disabled={disabled}
        >
          {disabled ? "진행 중~" : "폐쇄 진행"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisableAccountModal;
