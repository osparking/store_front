import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import "./MyQuillEditor.css";
import { getPlainContent } from "./utilities";

function MyQuillEditor({
  reviewContent,
  setReviewContent,
  reviewId,
  handleClose,
  saveEdit,
  editable,
  setLoading,
}) {
  const getTextLength = () => {
    return reviewContent ? getPlainContent(reviewContent).length : 0;
  };

  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    setContentLength(getTextLength());
  }, [reviewContent]);

  const handleEditorChange = (content, delta, source, editor) => {
    setReviewContent(content);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTextLength() === 0) {
      return toast.error("후기 내용을 작성하세요!");
    }
    try {
      setLoading(true);
      const reviewData = { id: reviewId, review: reviewContent };

      await saveEdit(reviewData);

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
    toolbar: editable
      ? [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ]
      : false,
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
        <Form.Group className="mb-0">
          <Form.Label>
            <h5 style={{ textAlign: "left" }}>경험 서술</h5>
          </Form.Label>
          <ReactQuill
            theme="snow"
            value={reviewContent}
            readOnly={!editable}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="여기에 후기를 작성하세요 :-)"
            style={{
              marginBottom: "50px",
              borderRadius: "4px",
            }}
          />
        </Form.Group>

        {/* Character count (optional) */}
        <div className="text-muted mb-2">글자수: {contentLength} 자</div>
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
