import { useState } from "react";
import { Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import FollowUpEditor from "../user/question/FollowUpEditor";
import FollowUpViewer from "../user/question/FollowUpViewer";
import QuestionEditor from "../user/question/QuestionEditor";
import { deleteQuestion } from "../user/question/QuestionService";
import QuestionViewer from "../user/question/QuestionViewer";
import "./QuestionFollowUpModal.css";

export default function QuestionFollowUpModal({
  show,
  handleClose,
  question,
  saveAnswer,
  mine,
  setReloadPage,
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

  return (
    <Modal
      id="question-followup-modal"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="quill-editor-modal"
      style={{ borderRadius: "8px" }}
    >
      <Modal.Header closeButton>
        <Modal.Title>질문 및 답변</Modal.Title>
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
    </Modal>
  );
}
