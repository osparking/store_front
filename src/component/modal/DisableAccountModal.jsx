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
      <Modal.Header className="bg-warning" closeButton>
        <Modal.Title>비활성화 효과</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        비활성화하면, 귀하는 자동 로그아웃되며, <br />
        추후, 이메일 검증을 통하여 계정을 활성화할 수 있습니다.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          그냥 두기
        </Button>
        <Button
          variant="danger"
          onClick={handleDisableAccount}
          disabled={disabled}
        >
          {disabled ? "진행 중~" : "비활성화"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DisableAccountModal;
