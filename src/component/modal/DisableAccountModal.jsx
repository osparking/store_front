import { Button, Modal } from "react-bootstrap";
import { logoutUser } from "../auth/AuthService";

const DisableAccountModal = ({
  show,
  onHide,
  keepAccountEnabled,
  userId,
  callUpdateUser,
  disabled,
  modalClass = "",
}) => {
  const handleDisableAccount = async () => {
    try {
      await callUpdateUser();
      onHide();
      logoutUser({ path: "/", message: "" });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Modal show={show} onHide={onHide} dialogClassName={modalClass}>
      <Modal.Header className="bg-warning no-radius" closeButton>
        <Modal.Title>비활성화 효과</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        계정을 비활성화하면, 귀하는 자동 로그아웃되며,<br />
        추후, 활성화는 이메일 검증을 통하여 가능합니다.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={keepAccountEnabled}>
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
