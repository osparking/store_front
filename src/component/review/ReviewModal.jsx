import _ from "lodash";
import { useContext, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { patchOrderReview } from "../buy/orderService";
import ConfirmationModal from "../modal/ConfirmationModal";
import { ReviewsContext } from "../user/UserDashboard";
import MyQuillEditor from "../util/MyQuillEditor";
import { callWithToken } from "../util/api";
import { getPlainContent } from "../util/utilities";
import Rating from "./Rating";
import "./ReviewModal.css";

export default function ReviewModal({
  show,
  handleClose,
  title,
  review,
  editable,
}) {
  if (!review) return;

  let refreshReviews = () => {};
  let refreshOrders = () => {};

  if (editable) {
    const context = useContext(ReviewsContext);
    refreshReviews = context?.refreshReviews || (() => {});
    refreshOrders = context?.refreshOrders || (() => {});
  }
  const [stars, setStars] = useState(0);

  const saveEdit = async (editorText) => {
    const reviewData = { stars: stars, ...editorText };
    const result = await patchOrderReview(reviewData);

    refreshReviews();
    refreshOrders();

    return result;
  };

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

  const [reviewContent, setReviewContent] = useState(null);
  const [reviewUnchanged, setReviewUnchanged] = useState(true);

  useEffect(() => {
    if (review) {
      setReviewContent(review.review);
      setStars(review.stars);
    }
  }, [review]);

  // 에디터를 실제로 그릴지 말지 결정하는 상태
  const [isEditorMounted, setIsEditorMounted] = useState(false);

  // 모달 애니메이션이 완전히 끝나면 에디터 마운트
  const handleEntered = () => {
    setIsEditorMounted(true);
  };

  // 모달이 닫힐 때 에디터 언마운트 (다음 열 때 다시 깨끗하게 시작)
  const handleExited = () => {
    setIsEditorMounted(false);
  };

  useEffect(() => {
    const contentEqual = _.isEqual(review.review, reviewContent);
    const starsEqual = stars === review.stars;

    setReviewUnchanged(contentEqual && starsEqual);
  }, [reviewContent, stars]);

  const resetReview = () => {
    setStars(review.stars);
    setReviewContent(review.review);
  };

  const getTextLength = () => {
    return reviewContent ? getPlainContent(reviewContent).length : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTextLength() === 0) {
      return toast.error("후기 내용을 작성하세요!");
    }
    try {
      setLoading(true);
      
      const reviewData = { id: review.id, review: reviewContent };
      const result = await saveEdit(reviewData);

      toast.success(result);
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("후기 저장 오류!");
    } finally {
      setLoading(false);
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
        onEntered={handleEntered} // ✅ fade-in 완료 후 실행
        onExited={handleExited} // ✅ fade-out 완료 후 실행
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
          {isEditorMounted && (
            <MyQuillEditor
              reviewContent={reviewContent}
              setReviewContent={setReviewContent}
              reviewId={review.id}
              handleClose={handleClose}
              editable={editable}
              setLoading={setLoading}
            />
          )}
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
              onClick={handleClose}
            >
              닫기
            </Button>
            {editable && (
              <>
                <Button
                  disabled={loading || reviewUnchanged}
                  variant="info"
                  type="button"
                  className="p-0"
                  onClick={resetReview}
                >
                  리셋
                </Button>
                <Form onSubmit={handleSubmit}>
                  <Button
                    variant="primary"
                    type="submit"
                    className="p-0"
                    style={{ cursor: "pointer" }}
                    disabled={loading || reviewUnchanged}
                  >
                    {loading ? <span>저장 중...</span> : "저장"}
                  </Button>
                </Form>
              </>
            )}
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
