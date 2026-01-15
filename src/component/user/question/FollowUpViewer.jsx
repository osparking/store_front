import "bootstrap/dist/css/bootstrap.min.css";
import { Form } from "react-bootstrap";
import "../../../App.css";
import QuillViewer from "./QuillViewer";

function FollowUpViewer({ followUp }) {
  console.log("followUp viewer");

  return (
    <Form className="mt-3 ms-3 mb-3">
      <Form.Label>
        <h5 style={{ textAlign: "left" }}>답변</h5>
      </Form.Label>
      <Form.Group className="mb-3 ms-3 me-4">
        <Form.Group className="mb-0" controlId="formBasicEmail">
          <Form.Label>내용</Form.Label>
          <QuillViewer question={followUp.content} />
        </Form.Group>
      </Form.Group>
    </Form>
  );
}

export default FollowUpViewer;