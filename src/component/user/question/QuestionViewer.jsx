import React from "react";
import { Form } from "react-bootstrap";
import QuillViewer from "./QuillViewer";

const QuestionViewer = ({ question, mine }) => {
  console.log("question viewer");
  return (
    <Form className="mt-0 ms-3 mb-3">
      <Form.Label>
        <h5 style={{ textAlign: "left" }}>
          {mine ? "나의 질문" : "고객 질문"}
        </h5>
      </Form.Label>
      <Form.Group className="mb-3 ms-3 me-4">
        <Form.Label className="mt-1" style={{ fontSize: "14px" }}>
          ※입력: {question.insertTime}
        </Form.Label>
        <Form.Group className="mb-0" controlId="formBasicEmail">
          <Form.Label className="mt-1">제목</Form.Label>
          <Form.Control
            type="text"
            maxLength={40}
            name="title"
            value={question.title}
            className="mb-3"
            style={{ fontSize: "13px" }}
            readOnly={true}
          />
        </Form.Group>
        <Form.Group className="mb-0" controlId="formBasicEmail">
          <Form.Label>내용</Form.Label>
          <QuillViewer question={question.question} />
        </Form.Group>
      </Form.Group>
    </Form>
  );
};

export default QuestionViewer;
