import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import "./MyQuillEditor.css";

function MyQuillEditor({ order, handleClose, saveReview }) {
  const [editorContent, setEditorContent] = useState(order.review);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const plainText = editorContent.replace(/<[^>]*>/g, "");
    if (plainText.trim().length === 0) {
      return toast.error("후기 내용을 작성하세요!");
    }
    try {
      setLoading(true);
      const reviewData = { id: order.id, review: editorContent };

      await saveReview(reviewData);

      toast.success("후기 저장 성공.");
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("후기 저장 오류!");
    } finally {
      setLoading(false);
    }
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
            <h5>{order.orderName} 구매 후기</h5>
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
          글자수: {editorContent?.replace(/<[^>]*>/g, "").length}자
        </div>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="secondary"
            type="button"
            className="px-4"
            onClick={() => handleClose()}
          >
            닫기
          </Button>
          <Button
            variant="primary"
            type="submit"
            className="px-4"
            style={{ cursor: "pointer" }}
            disabled={loading}
          >
            {loading ? <span>저장 중...</span> : "저장"}
          </Button>
          <Button
            variant="outline-secondary"
            type="button"
            className="px-3"
            onClick={() => setEditorContent("")}
          >
            초기화
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
