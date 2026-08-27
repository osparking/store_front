import { useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { ManageWorkersContext } from "../admin/ManageWorkers";
import { logoutUser } from "../auth/AuthService";
import { disableUserAccount } from "../user/UserService";

const DisableAccountModal = ({
  show,
  onHide,
  userId,
  callUpdateUser,
  disabled,
  accountOwner = true,
  modalClass = "",
}) => {
  const manageWorkersContext = useContext(ManageWorkersContext);
  const readWorkerList = manageWorkersContext?.readWorkerList;

  const handleDisableAccount = async () => {
    try {
      if (userId) {
        const result = await disableUserAccount(userId);
        if (readWorkerList) {
          readWorkerList();
        }
        toast(result.message);
      } else {
        await callUpdateUser();
      }
      onHide();
      if (accountOwner) {
        logoutUser({ path: "/", message: "" });
      }
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
        {accountOwner ? (
          <>
            계정을 비활성화하면, 귀하는 자동 로그아웃되며, <br />
          </>
        ) : (
          <>
            계정을 비활성화하면, 해당 직원은 <br />
          </>
        )}
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
