import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import FollowUpEditor from "../user/question/FollowUpEditor";
import FollowUpViewer from "../user/question/FollowUpViewer";
import QuestionEditor from "../user/question/QuestionEditor";
import { deleteQuestion } from "../user/question/QuestionService";
import QuestionViewer from "../user/question/QuestionViewer";
import "./QuestionFollowUpModal.css";
import DraggableDialog from "../common/DraggableDialog";
import { useCallback, useRef, useState } from "react";
import { useMaximize } from "../common/MaximizeContext";

export default function QuestionFollowUpModal({
  show,
  handleClose,
  question,
  saveAnswer,
  mine,
  setReloadPage,
  minWidth = 400,
  minHeight = 300,
}) {
  const followUps = question.followUpRows;
  const is_admin = localStorage.getItem("IS_ADMIN") === "true";
  const justReadQuestion = (followUps && followUps.length > 0) || is_admin;
  const showFollowUpEditor =
    (question.answered && !is_admin) || (is_admin && !question.answered);

  const performDeletion = async () => {
    try {
      await deleteQuestion(question.id);
      toast.success("질문 삭제 성공");
      setReloadPage(true);
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("질문 삭제 실패!");
    }
  };

  const contentRef = useRef(null);
  const dragState = useRef(null);

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

  // 에디터를 실제로 그릴지 말지 결정하는 상태
  const [isEditorMounted, setIsEditorMounted] = useState(false);

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

  const { isMaximized, setIsMaximized, toggleMaximize } = useMaximize();

  return (
    <Modal
      id="question-followup-modal"
      show={show}
      onHide={handleClose}
      onEntered={handleEntered} // ✅ fade-in 완료 후 실행
      onExited={handleExited} // ✅ fade-out 완료 후 실행
      backdrop="static"
      keyboard={false}
      dialogClassName="quill-editor-modal"
      style={{ borderRadius: "8px" }}
      dialogAs={DraggableDialog}
    >
      <Modal.Header closeButton>
        <Modal.Title>질문 및 답변(질문 제목: {question.title})</Modal.Title>
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
      <Modal.Body className="h-limited-body">
        {showFollowUpEditor && (
          <FollowUpEditor
            questionId={question.id}
            followUp={{ content: "" }}
            handleClose={handleClose}
            saveAnswer={saveAnswer}
            editable={true}
            setReloadPage={setReloadPage}
            headText={is_admin ? "범이 답변" : "추가 질문"}
            evenOdd={is_admin ? "viewer-even" : "viewer-odd"}
            isAdmin={is_admin}
          />
        )}
        {followUps &&
          [...followUps].reverse().map((followUp, idx, arr) =>
            idx === 0 && // 마지막 댓글
            ((question.answered && is_admin) || // 관리자가 댓글(답변) 편집
              (!question.answered && !is_admin)) ? ( // 질문자가 후속질문
              <FollowUpEditor
                questionId={question.id}
                followUp={followUp}
                handleClose={handleClose}
                saveAnswer={saveAnswer}
                editable={true}
                setReloadPage={setReloadPage}
                key={idx}
                headText={followUp.bumWrote ? "범이 답변" : "추가 질문"}
                evenOdd={followUp.bumWrote ? "viewer-even" : "viewer-odd"}
              />
            ) : (
              <FollowUpViewer
                followUp={followUp}
                key={idx}
                headText={followUp.bumWrote ? "범이 답변" : "추가 질문"}
                evenOdd={followUp.bumWrote ? "viewer-even" : "viewer-odd"}
              />
            ),
          )}
        {justReadQuestion ? (
          <QuestionViewer question={question} mine={mine} />
        ) : (
          <QuestionEditor
            question={question}
            mine={mine}
            handleClose={handleClose}
            setReloadPage={setReloadPage}
            performDeletion={performDeletion}
          />
        )}
      </Modal.Body>
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
  );
}
