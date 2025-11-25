import { Button, Modal } from "react-bootstrap";

export default function ConfirmationModal({
  show,
  handleClose,
  handleConfirm,
  getMessage,
  title,
}) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{getMessage()}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          상태유지
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          발주확인
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
