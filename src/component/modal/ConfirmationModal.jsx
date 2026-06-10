import { Button, Modal } from "react-bootstrap";
import "./ConfirmationModal.css";

export default function ConfirmationModal({
  show,
  handleClose,
  handleConfirm,
  bodyMessage,
  title,
  noLabel,
  yesLabel,
  yesVariant = "primary",
  headerBgColor = "",
  modelClassName = "",
  dialogClassName = "",
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      className={`${modelClassName}`}
      dialogClassName={dialogClassName}
    >
      <Modal.Header closeButton className={`${headerBgColor}`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="flex-fill">
          {noLabel}
        </Button>
        <Button
          variant={yesVariant}
          onClick={() => handleConfirm()}
          className="flex-fill ms-2"
        >
          {yesLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
