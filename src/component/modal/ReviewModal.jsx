import { Modal } from "react-bootstrap";
import MyQuillEditor from "../util/MyQuillEditor";

export default function ReviewModal({ show, handleClose, title, orderName }) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MyQuillEditor orderName={orderName} />
      </Modal.Body>
    </Modal>
  );
}
