import { Modal } from "react-bootstrap";
import MyQuillEditor from "../util/MyQuillEditor";

export default function ReviewModal({
  show,
  handleClose,
  title,
  order,
  saveReview,
  editable
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="xl"
      dialogClassName="quill-editor-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
  <MyQuillEditor
    order={order}
    handleClose={handleClose}
    saveReview={saveReview}
    editable={editable}
  />
      </Modal.Body>
    </Modal>
  );
}
