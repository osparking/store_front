import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import DraggableDialog from "../common/DraggableDialog";
import { MaximizeContext } from "../common/MaximizeContext";
import ConfirmationModal from "../modal/ConfirmationModal";
import MyQuillEditor from "../util/MyQuillEditor";
import { callWithToken } from "../util/api";
import Rating from "./Rating";
import "./ReviewModal.css";

export default function ReviewModalRead({
  show,
  handleClose,
  title,
  review,
  minWidth = 400,
  minHeight = 300,
}) {
  if (!review) return;

  const [stars, setStars] = useState(0);
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
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!show) setIsMaximized(false);
  }, [show]);

  const toggleMaximize = () => {
    if (!isMaximized) {
      // 최대화: 먼저 저장, 그 다음 상태 변경
      saveStateRef.current?.();
      setIsMaximized(true);
    } else {
      // 복원: 먼저 상태 변경, 그 다음 복원
      setIsMaximized(false);
      // CSS 클래스가 빠진 뒤 복원되도록 다음 틱에
      requestAnimationFrame(() => restoreStateRef.current?.());
    }
  };

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

    // ✅ 모달이 완전히 열린 후 .modal-content DOM 확보
    const el = document.querySelector(".quill-editor-modal .modal-content");
    if (el) {
      contentRef.current = el;
    }
  };

  // 모달이 닫힐 때 에디터 언마운트 (다음 열 때 다시 깨끗하게 시작)
  const handleExited = () => {
    setIsEditorMounted(false);
    contentRef.current = null; // 정리
  };

  useEffect(() => {
    const contentEqual = _.isEqual(review.review, reviewContent);
    const starsEqual = stars === review.stars;

    setReviewUnchanged(contentEqual && starsEqual);
  }, [reviewContent, stars, review]);

  const contentRef = useRef(null);
  const dragState = useRef(null);
  const saveStateRef = useRef(null);
  const restoreStateRef = useRef(null);

  const contextValue = useMemo(
    () => ({
      isMaximized,
      registerSave: (fn) => {
        saveStateRef.current = fn;
      },
      registerRestore: (fn) => {
        restoreStateRef.current = fn;
      },
    }),
    [isMaximized],
  );

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const el = contentRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();

      // 중앙 정렬로 인한 위치 흔들림 방지: 현재 위치를 고정
      el.style.margin = "0";
      el.style.position = "relative";
      el.style.left = "0";
      el.style.top = "0";
      el.style.width = rect.width + "px";
      el.style.height = rect.height + "px";
      el.style.maxWidth = "none";

      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: rect.width,
        startH: rect.height,
      };

      const onMouseMove = (ev) => {
        const s = dragState.current;
        if (!s || !contentRef.current) return;
        const w = Math.max(minWidth, s.startW + (ev.clientX - s.startX));
        const h = Math.max(minHeight, s.startH + (ev.clientY - s.startY));
        contentRef.current.style.width = w + "px";
        contentRef.current.style.height = h + "px";
      };

      const onMouseUp = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
        document.body.style.userSelect = "";
      };

      document.body.style.userSelect = "none"; // 드래그 중 텍스트 선택 방지
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    },
    [minWidth, minHeight],
  );

  return (
    <MaximizeContext.Provider value={contextValue}>
      <Modal
        show={show}
        onHide={handleClose}
        onEntered={handleEntered} // ✅ fade-in 완료 후 실행
        onExited={handleExited} // ✅ fade-out 완료 후 실행
        backdrop="static"
        keyboard={false}
        size="xl"
        dialogClassName="quill-editor-modal"
        dialogAs={DraggableDialog}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
          <button
            type="button"
            className="maximize-btn"
            onClick={toggleMaximize}
            aria-label={isMaximized ? "복원" : "최대화"}
            title={isMaximized ? "복원" : "최대화"}
          >
            {isMaximized ? "❐" : "⤢"}
          </button>
        </Modal.Header>
        <Modal.Body id="review-modal-body">
          <h5>주문명: {review && review.orderName}</h5>
          <Rating
            stars={stars}
            setStars={setStars}
            editable={false}
            review={review}
          />
          {isEditorMounted && (
            <MyQuillEditor
              value={reviewContent}
              onChange={setReviewContent}
              editable={false}
              getContent={() => reviewContent} // 현재 상태를 반환하는 함수 전달
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="center-buttons quill-buttons char2button">
            <Button
              variant="secondary"
              type="button"
              className="p-0"
              onClick={handleClose}
            >
              닫기
            </Button>
          </div>
        </Modal.Footer>
        {/* 우하귀 리사이즈 핸들 */}
        <div
          className="resize-handle"
          onMouseDown={handleMouseDown}
          role="separator"
          aria-label="Resize"
          style={{
            position: "absolute",
            right: 0,
            bottom: 0,
            width: 18,
            height: 18,
            cursor: "nwse-resize",
            zIndex: 1055,
            background:
              "linear-gradient(135deg, transparent 0 55%, #adb5bd 55% 60%, transparent 60% 70%, #adb5bd 70% 75%, transparent 75%)",
          }}
        />
      </Modal>
    </MaximizeContext.Provider>
  );
}
