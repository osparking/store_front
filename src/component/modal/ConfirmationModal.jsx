import { Button, Modal } from "react-bootstrap";

export default function ConfirmationModal({
  show,
  handleClose,
  handleConfirm,
  bodyMessage,
  title,
  noLabel,
  yesLabel,
  headerBgColor = "",
}) {
  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton className={`${headerBgColor}`}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{bodyMessage}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} className="flex-fill">
          {noLabel}
        </Button>
        <Button
          variant="primary"
          onClick={() => handleConfirm()}
          className="flex-fill ms-2"
        >
          {yesLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
