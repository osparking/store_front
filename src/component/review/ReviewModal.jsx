import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { ReviewsContext } from "../user/UserDashboard";
import MyQuillEditor from "../util/MyQuillEditor";
import { callWithToken } from "../util/api";
import Rating from "./Rating";
import "./ReviewModal.css";
import ConfirmationModal from "../modal/ConfirmationModal";

export default function ReviewModal({
  show,
  handleClose,
  title,
  review,
  saveReview,
  editable,
}) {
  let refreshReviews = () => {};
  let refreshOrders = () => {};

  if (editable) {
    const context = useContext(ReviewsContext);
    refreshReviews = context?.refreshReviews || (() => {});
    refreshOrders = context?.refreshOrders || (() => {});
  }
  const [stars, setStars] = useState(0);
  const starsRemains = () => {
    return review && review.stars === stars;
  };

  const saveEdit = (editorText) => {
    const reviewData = { stars: stars, ...editorText };
    saveReview(reviewData);
    refreshReviews();
    refreshOrders();
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
      refreshReviews();
      refreshOrders();
      handleClose(true);
    } finally {
      setLoading(false);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const confirmDeletion = async () => {
    try {
      await performDeletion(review.id);
      setShowModal(false);
    } catch (err) {
      console.error("err: ", err);
      toast.error("후기 삭제 실패!");
    }
  };

  return (
    <>
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={confirmDeletion}
        bodyMessage="후기를 삭제하려면, 삭제 버튼을 누르십시오!"
        title="후기 삭제 확인"
        noLabel="취소"
        yesLabel="삭제"
        yesVariant="danger"
        headerBgColor="bg-warning"
        modelClassName="modal-slide-down"
        dialogClassName="review-deletion-confirmation-modal"
      />
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
            setStars={setStars}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="center-buttons quill-buttons char2button">
            {review.review && editable && (
              <Button
                variant="danger"
                type="button"
                className="p-0"
                disabled={loading}
                onClick={() => setShowModal(true)}
              >
                삭제
              </Button>
            )}
            <Button
              variant="secondary"
              type="button"
              className="p-0"
              onClick={() => handleClose()}
            >
              닫기
            </Button>
            {editable && (
              <>
                {/* <Button
            disabled={loading || (contentsRemains && starsRemains())}
            variant="info"
            type="button"
            className="p-0"
            onClick={resetReview}
          >
            리셋
          </Button> */}
                {/* <Button
            variant="primary"
            type="submit"
            className="p-0"
            style={{ cursor: "pointer" }}
            disabled={loading || (contentsRemains && starsRemains())}
          >
            {loading ? <span>저장 중...</span> : "저장"}
          </Button> */}
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
