import { useContext, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { ReviewsContext } from "../user/UserDashboard";
import MyQuillEditor from "../util/MyQuillEditor";
import { callWithToken } from "../util/api";
import Rating from "./Rating";
import "./ReviewModal.css";

export default function ReviewModal({
  show,
  handleClose,
  title,
  review,
  saveReview,
  editable,
}) {
  let refreshReviews = () => {};

  if (editable) {
    const context = useContext(ReviewsContext);
    refreshReviews = context?.refreshReviews || (() => {});
  }
  const [stars, setStars] = useState(0);
  const saveEdit = (editorText) => {
    const reviewData = { stars: stars, ...editorText };
    saveReview(reviewData);
    refreshReviews();
  };

  useEffect(() => {
    setStars(review && review.stars);
  }, [review]);

  const [loading, setLoading] = useState(false);

  const performDeletion = async (orderId) => {
    try {
      setLoading(true);
      const result = await callWithToken(
        "patch",
        `/order/${orderId}/delete_review`,
      );
      toast.success("후기 삭제 완료");
      handleClose(true);
    } finally {
      setLoading(false);
    }
  };

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
      <Modal.Body id="review-modal-body">
        <h5>주문명: {review && review.orderName}</h5>
        <Rating
          stars={stars}
          setStars={setStars}
          editable={editable}
          review={review}
        />
        <MyQuillEditor
          order={review}
          handleClose={handleClose}
          saveEdit={saveEdit}
          editable={editable}
          performDeletion={performDeletion}
        />
      </Modal.Body>
    </Modal>
  );
}
