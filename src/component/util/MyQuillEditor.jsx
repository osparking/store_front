import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
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
      <h5 className="mb-2" style={{ textAlign: "left" }}>
        경험 서술
      </h5>
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
      <div className="text-muted mb-2">글자수: {contentLength} 자</div>
    </Container>
  );
}

export default MyQuillEditor;
