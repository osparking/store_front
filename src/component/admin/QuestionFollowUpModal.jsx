import { Form, Modal } from "react-bootstrap";
import FollowUpEditor from "../user/question/FollowUpEditor";
import QuestionViewer from "../user/question/QuestionViewer";
import "./QuestionFollowUpModal.css";

export default function QuestionFollowUpModal({
  show,
  handleClose,
  question,
  saveAnswer,
}) {
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
        <Modal.Title>답변 작성</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ paddingTop: 0 }}>
        <FollowUpEditor
          question={question}
          handleClose={handleClose}
          saveAnswer={saveAnswer}
          editable={true}
        />
        <Form className="mt-3 ms-3 mb-3">
          <Form.Label>
            <h5 style={{ textAlign: "left" }}>고객 질문</h5>
          </Form.Label>
          <Form.Group className="mb-3 ms-3 me-4">
            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label className="mt-1">제목</Form.Label>
              <Form.Control
                type="text"
                maxLength={40}
                name="title"
                value={question.title}
                className="mb-3"
                style={{ fontSize: "13px" }}
                readOnly={"true"}
              />
            </Form.Group>
            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label>내용</Form.Label>
              <QuestionViewer question={question.question} />
            </Form.Group>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
