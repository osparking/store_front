import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App.css";
import "./MyQuillEditor.css";

function MyQuillEditor({orderName}) {
  const [editorContent, setEditorContent] = useState("");

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Editor Content:", editorContent);

    // Get plain text version
    const plainText = editorContent.replace(/<[^>]*>/g, "");
    console.log("Plain Text:", plainText);

    // Handle saving or processing the content
    // Example: send to API
    // await saveContent(editorContent);
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "indent",
    "color",
    "background",
    "align",
    "link",
    "image",
    "video",
  ];

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <h5>{orderName} 구매 후기</h5>
          </Form.Label>
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="여기에 후기를 작성하세요 :-)"
            style={{
              height: "250px",
              marginBottom: "50px",
              borderRadius: "4px",
            }}
          />
        </Form.Group>

        {/* Character count (optional) */}
        <div className="text-muted mb-3">
          글자수: {editorContent.replace(/<[^>]*>/g, "").length}자
        </div>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="primary"
            type="submit"
            className="px-4"
            style={{ cursor: "pointer" }}
          >
            저장
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => setEditorContent("")}
          >
            지우기
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
