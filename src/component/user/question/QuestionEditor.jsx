import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import { expiredTokenRemoved, getPlainContent } from "../../util/utilities";
import "./QuestionEditor.css";
import { saveQuestion } from "./QuestionService";

function QuestionEditor({ question, mine, handleClose, setReloadPage }) {
  if (expiredTokenRemoved()) {
    console.log("토큰 만료 > 로그인으로 재방향");
    navigate("/login", {
      state: {
        from: "/question",
        source: "question",
      },
    });
  }

  const [editorContent, setEditorContent] = useState(
    question ? question.question : "",
  );
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

  const closeEditor = () => {
    handleClose
      ? handleClose() // 질문 댓글 모달 닫고, 질문 목록으로 복귀
      : navigate(-1); // [질문하기] 성분 닫고, 그전 방문지로 귀환
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
        id: question?.id ?? 0,
        userId: userId,
        title: title,
        question: editorContent,
      };

      await saveQuestion(questionData);

      toast.success("질문 저장 성공.");
      localStorage.setItem("DASHBOARD_TAB", "my_question");
      localStorage.setItem("QUESTION_PAGE", 1);

      if (setReloadPage) {
        // 모달 내포 퀼 편집기 - 갱신된 질문 저장
        setReloadPage(true);
        handleClose();
      } else {
        // 고객 질문 입력 후 저장 처리
        const id = localStorage.getItem("LOGIN_ID");
        navigate(`/dashboard/${id}/user`);
      }
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

  // 제목 상자에 탭 핸들러 추가: 내용 편집기로 촛점 이동
  const quillRef = useRef(null);

  useEffect(() => {
    const handleTitleKeyDown = (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        if (quillRef.current && quillRef.current.getEditor()) {
          const editor = quillRef.current.getEditor();
          editor.focus();
        }
      }
    };

    const titleInput = document.querySelector('input[name="title"]');
    if (titleInput) {
      titleInput.addEventListener("keydown", handleTitleKeyDown);
      return () => {
        titleInput.removeEventListener("keydown", handleTitleKeyDown);
      };
    }
  }, []);

  return (
    <div className="d-flex justify-content-center align-items-center vh-67">
      <Form
        onSubmit={handleSubmit}
        className={mine ? "question-editor-modal" : "question-editor-window"}
      >
        <Form.Group className="mb-3">
          <Form.Label>
            <h5 style={{ textAlign: "left" }}>
              {mine ? "나의 질문" : "고객 질문"}
            </h5>
          </Form.Label>
          <Form.Group className="mb-0" controlId="formBasicEmail">
            <Form.Label className="mt-3">제목</Form.Label>
            <Form.Control
              type="text"
              maxLength={40}
              name="title"
              defaultValue={question ? question.title : ""}
              placeholder="(제목 입력)"
            />
            <Form.Text className="text-muted ms-2">
              (내용을 30 자 내외로 요약하세요.)
            </Form.Text>
          </Form.Group>
          <Form.Label className="mt-3">내용</Form.Label>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={editorContent || placeholder}
            onChange={handleEditorChange}
            onFocus={clearPlaceholder}
            onBlur={handleEditorBlur}
            modules={modules}
            formats={formats}
            className="content-edit"
          />
        </Form.Group>

        <div className="text-muted mb-3">글자수: {getTextLength()} 자</div>

        <div className="d-flex gap-2 justify-content-center mb-3">
          <Button
            variant="secondary"
            type="button"
            className="px-4"
            onClick={() => closeEditor()}
          >
            닫기
          </Button>
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
        </div>
      </Form>
    </div>
  );
}

export default QuestionEditor;
