import { Button, Form, Modal } from "react-bootstrap";
import FollowUpEditor from "../user/question/FollowUpEditor";
import QuestionViewer from "../user/question/QuestionViewer";
import "./QuestionFollowUpModal.css";
import FollowUpViewer from "../user/question/FollowUpViewer";
import QuestionEditor from "../user/question/QuestionEditor";

export default function QuestionFollowUpModal({
  show,
  handleClose,
  question,
  saveAnswer,
  mine,
}) {
  const is_admin = localStorage.getItem("IS_ADMIN") === "true";

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
        {question.answered && !is_admin ? (
          <FollowUpViewer followUp={{ content: "(디비에서 읽어온 답변)" }} />
        ) : (
          is_admin && (
            <FollowUpEditor
              followUp={{ content: "" }}
              handleClose={handleClose}
              saveAnswer={saveAnswer}
              editable={true}
            />
          )
        )}
        <div className="mt-5">
          {(question.answered || is_admin) ? (
            <QuestionViewer question={question} mine={mine} />
          ) : (
            <QuestionEditor
              question={question}
              mine={mine}
              handleClose={handleClose}
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
