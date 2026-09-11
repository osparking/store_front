import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import "./MyQuillEditor.css";
import { getPlainContent } from "./utilities";
import toast from "react-hot-toast";

const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB (5,242,880 bytes)

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

  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;

      // ✅ 여기서 크기 검사!
      if (file.size  + reviewContent.length > MAX_FILE_SIZE) {
        toast.error("영상 포함, 후기 크기는 최대 5MB 입니다!");
        return;
      }

      // 통과한 파일만 base64로 에디터에 삽입
      const reader = new FileReader();
      reader.onload = () => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, "image", reader.result, "user");
        quill.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
    };
  };

  // Custom toolbar configuration
  const modules = {
    toolbar: {
      container: [
        ...(editable
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
          : []),
      ],
      handlers: { image: imageHandler },
    },
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
