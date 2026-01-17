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
  const is_admin = localStorage.getItem("IS_ADMIN") === "true";
  const justReadQuestion = question.answered || is_admin;

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
        {question.followUpRows &&
          question.followUpRows.map((followUp, idx, arr) =>
            idx === arr.length - 1 && is_admin ? (
              <FollowUpEditor
                questionId={question.id}
                followUp={followUp}
                handleClose={handleClose}
                saveAnswer={saveAnswer}
                editable={true}
                key={idx}
              />
            ) : (
              <FollowUpViewer
                followUp={{ content: followUp.content }}
                key={idx}
              />
            )
          )}
        {is_admin &&
          question.followUpRows &&
          question.followUpRows.length === 0 && (
            <FollowUpEditor
              questionId={question.id}
              followUp={{ content: "" }}
              handleClose={handleClose}
              saveAnswer={saveAnswer}
              editable={true}
            />
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
