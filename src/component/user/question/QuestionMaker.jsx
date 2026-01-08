import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import "./QuestionMaker.css";
import { saveQuestion } from "./QuestionService";
import { getPlainContent } from "../../util/utilities";

function QuestionMaker({ editable }) {
  const [editorContent, setEditorContent] = useState("");
  const [saving, setSaving] = useState(false);
  const promptMessage = "여기에 질문을 작성하세요 :-)";
  const [placeholder, setPlaceholder] = useState(promptMessage);

  const handleEditorChange = (content) => {
    setEditorContent(content);
  };

  const clearPlaceholder = () => {
    if (getPlainContent(editorContent) === promptMessage) {
      setEditorContent("");
      setPlaceholder("");
    }
  };

  const handleEditorBlur = () => {
    if (getPlainContent(editorContent) === "") {
      setPlaceholder(promptMessage);
      setEditorContent("");
    }
  };
  
  const getTextLength = () => {
    if (!editorContent) return 0;

    const plainContent = getPlainContent(editorContent);
    return plainContent === promptMessage ? 0 : plainContent.length;
  };

  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.elements.title.value;

    if (title.trim().length === 0 || getTextLength() === 0) {
      return toast.error("질문 제목과 내용을 둘 다 작성하세요!");
    }
    try {
      const userId = localStorage.getItem("LOGIN_ID");

      setSaving(true);
      const questionData = {
        userId: userId,
        title: title,
        question: editorContent,
      };

      await saveQuestion(questionData);

      toast.success("질문 저장 성공.");
      // handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("질문 저장 오류!");
    } finally {
      setSaving(false);
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
    <Container className="mt-5 question-container mb-5">
      <Form onSubmit={handleSubmit} className="p-3">
        <Form.Group className="mb-3">
          <Form.Label>
            <h5 style={{ textAlign: "left" }}>질문 작성</h5>
          </Form.Label>
          <Form.Group className="mb-0" controlId="formBasicEmail">
            <Form.Label className="mt-3">제목</Form.Label>
            <Form.Control
              type="text"
              maxLength={40}
              name="title"
              placeholder="(제목 입력)"
            />
            <Form.Text className="text-muted ms-2">
              (내용을 30 자 내외로 요약하세요.)
            </Form.Text>
          </Form.Group>
          <Form.Label className="mt-3">내용</Form.Label>
          <ReactQuill
            theme="snow"
            value={editorContent || placeholder}
            readOnly={!editable}
            onChange={handleEditorChange}
            onFocus={clearPlaceholder}
            onBlur={handleEditorBlur}
            modules={modules}
            formats={formats}
            style={{
              height: "230px",
              marginBottom: "70px",
              borderRadius: "4px",
            }}
          />
        </Form.Group>

        <div className="text-muted mb-3">글자수: {getTextLength()} 자</div>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Button
            variant="secondary"
            type="button"
            className="px-4"
            onClick={() => handleClose()}
          >
            닫기
          </Button>
          {editable && (
            <>
              <Button
                variant="primary"
                type="submit"
                className="px-4"
                style={{ cursor: "pointer" }}
                disabled={saving}
              >
                {saving ? <span>저장 중...</span> : "저장"}
              </Button>
              <Button
                variant="outline-secondary"
                type="button"
                className="px-3"
                onClick={() => setEditorContent("")}
              >
                초기화
              </Button>
            </>
          )}
        </div>
      </Form>
    </Container>
  );
}

export default QuestionMaker;
