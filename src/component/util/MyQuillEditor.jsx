import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import "../editor/CustomVideoBlot"; // CustomVideoBlot 등록
import { useQuillMediaHandlers } from "../editor/useQuillMediaHandlers";
import "./MyQuillEditor.css";
import { getPlainContent } from "./utilities";

function MyQuillEditor({
  value,
  onChange,
  editable,
  getContent, // 현재 상태를 반환하는 함수
}) {
  const { quillRef, imageHandler, videoHandler } = useQuillMediaHandlers(
    getContent ?? (() => value),
  );

  const getTextLength = () => {
    return value ? getPlainContent(value).length : 0;
  };

  const [contentLength, setContentLength] = useState(0);

  useEffect(() => {
    setContentLength(getTextLength());
  }, [value]);

  const handleEditorChange = (content, delta, source, editor) => {
    onChange(content);
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: editable
      ? {
          container: [
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ color: [] }, { background: [] }],
            [{ align: [] }],
            ["link", "image", "video"],
            ["clean"],
          ],
          handlers: {
            image: imageHandler,
            video: videoHandler,
          },
        }
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
        ref={quillRef}
        theme="snow"
        value={value}
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
