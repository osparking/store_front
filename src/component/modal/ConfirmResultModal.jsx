import { Button, Modal } from "react-bootstrap";
import "./ConfirmResultModal.css";

const ConfirmResultModal = ({ show, closer, switchLabel, dialogClass }) => {
  const getModalMessage = () => {
    switch (switchLabel) {
      case "토큰 재발급됨":
        return (
          <>
            <p className="text-success mb-3" style={{ textAlign: "center" }}>
              회원의 이메일 주소 검증을 위하여...
            </p>
            <p>귀하께 <b>새 이메일이 발송</b>되었으니,</p>
            <p>
              이메일에 포함된 <b>링크를 클릭</b>하여 계정을 활성화하십시오.
            </p>
          </>
        );
      default:
        return (
          <p className="text-danger mb-3" style={{ textAlign: "center" }}>
            예외적인 스위치 라벨: {switchLabel}
          </p>
        );
    }
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName={dialogClass}>
      <Modal.Header closeButton>
        <Modal.Title>이메일 소유 확인 결과</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getModalMessage()}</Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closer}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmResultModal;
