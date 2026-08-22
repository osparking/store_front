import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import ConfirmationModal from "../modal/ConfirmationModal";
import "./MyQuillEditor.css";
import { getPlainContent } from "./utilities";

function MyQuillEditor({
  order,
  handleClose,
  saveEdit,
  editable,
  performDeletion,
  setStars,
}) {
  const [editorContent, setEditorContent] = useState(order.review);
  const contentsRemains = order.review === editorContent;

  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const getTextLength = () => {
    return editorContent ? getPlainContent(editorContent).length : 0;
  };

  const resetReview = () => {
    setEditorContent(order.review);
    setStars(order.stars);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTextLength() === 0) {
      return toast.error("후기 내용을 작성하세요!");
    }
    try {
      setLoading(true);
      const reviewData = { id: order.id, review: editorContent };

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

  const confirmDeletion = async () => {
    try {
      await performDeletion(order.id);
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("후기 삭제 실패!");
    }
  };

  return (
    <Container className="mt-4">
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-0">
          <Form.Label>
            <h5 style={{ textAlign: "left" }}>경험 서술</h5>
          </Form.Label>
          <ReactQuill
            theme="snow"
            value={editorContent}
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
        <div className="text-muted mb-2">글자수: {getTextLength()} 자</div>
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
