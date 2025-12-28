import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Rating from "../review/Rating";
import MyQuillEditor from "../util/MyQuillEditor";

export default function ReviewModal({
  show,
  handleClose,
  title,
  order,
  saveReview,
  editable,
}) {
  const [stars, setStars] = useState(0);
  const saveEdit = (editorText) => {
    const reviewData = { stars: stars, ...editorText };
    saveReview(reviewData);
  };

  useEffect(() => {
    setStars(order && order.stars);
  }, [order]);

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
        <Rating stars={stars} setStars={setStars} />
        <MyQuillEditor
          order={order}
          handleClose={handleClose}
          saveEdit={saveEdit}
          editable={editable}
        />
      </Modal.Body>
    </Modal>
  );
}
