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
  const buttonSize = yesLabel.length === 2 ? "char2button" : "char4button";
  
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
      <Modal.Footer className={`d-flex justify-content-center ${buttonSize}`}>
        <Button variant="secondary" onClick={handleClose} className="p-0">
          {noLabel}
        </Button>
        <Button
          variant={yesVariant}
          onClick={() => handleConfirm()}
          className="p-0"
        >
          {yesLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
