import { Button, Modal } from "react-bootstrap";
import FollowUpEditor from "../user/question/FollowUpEditor";
import FollowUpViewer from "../user/question/FollowUpViewer";
import QuestionEditor from "../user/question/QuestionEditor";
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
  const justReadQuestion =
    (followUps && followUps.length > 0) || is_admin;
  const showFollowUpEditor =
    (question.answered && !is_admin) || (is_admin && !question.answered);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="quill-editor-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {question.answered ? "답변 보기" : "질문 보기"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: 0 }}>
        {showFollowUpEditor && (
          <FollowUpEditor
            questionId={question.id}
            followUp={{ content: "" }}
            handleClose={handleClose}
            saveAnswer={saveAnswer}
            editable={true}
            setReloadPage={setReloadPage}
            headText={is_admin ? "범이 답변" : "추가 질문"}
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
              />
            ) : (
              <FollowUpViewer
                followUp={{ content: followUp.content }}
                key={idx}
                headText={followUp.bumWrote ? "범이 답변" : "추가 질문"}
              />
            ),
          )}
        <div className="mt-5">
          {justReadQuestion ? (
            <QuestionViewer question={question} mine={mine} />
          ) : (
            <QuestionEditor
              question={question}
              mine={mine}
              handleClose={handleClose}
              setReloadPage={setReloadPage}
            />
          )}
        </div>
        {question.answered && mine && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              variant="secondary"
              className="w-60 mt-4 mb-4 px-4"
              onClick={handleClose}
            >
              닫기
            </Button>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
