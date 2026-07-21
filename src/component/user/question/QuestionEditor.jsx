import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import { getPlainContent } from "../../util/utilities";
import "./QuestionEditor.css";
import { saveQuestion } from "./QuestionService";

function QuestionEditor({ question, mine, handleClose, setReloadPage }) {
  const navigate = useNavigate();
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

  const closeEditor = () => {
    handleClose
      ? handleClose() // 질문 댓글 모달 닫고, 질문 목록으로 복귀
      : navigate(-1); // [질문하기] 성분 닫고, 그전 방문지로 귀환
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const title = e.target.elements.questionTitle.value;

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

      const result = await saveQuestion(questionData);

      if (result) {
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
    <div
      id="questionEditorContainer"
      className="d-flex justify-content-center align-items-center"
    >
      <Card className="p-0 customerQuestionCard">
        <Card.Body>
          <div className="d-flex p-3 justify-content-center align-items-center vh-67">
            <Form
              onSubmit={handleSubmit}
              className={
                mine ? "question-editor-modal" : "question-editor-window"
              }
            >
              <h4>{mine ? "나의 질문" : "고객 질문"}</h4>
              <Form.Group className="mb-0">
                <Form.Label className="mt-3" htmlFor="questionTitle">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0">제목</h5>
                    <Form.Text className="text-muted ms-2">
                      (내용을 최대 30 자로 작성하세요.)
                    </Form.Text>
                  </div>
                </Form.Label>
                <Form.Control
                  type="text"
                  maxLength={30}
                  id="questionTitle"
                  defaultValue={question ? question.title : ""}
                  placeholder="(제목 입력)"
                  className="mt-0 ps-3 serif question-title-input"
                  onKeyDown={(e) => {
                    if (e.key === "Tab") {
                      e.preventDefault(); // 기본 탭 이동 방지
                      if (quillRef.current) {
                        quillRef.current.focus(); // ReactQuill에 포커스
                      }
                    }
                  }}
                />
              </Form.Group>
              <Form.Label className="mt-3">
                <div className="d-flex">
                  <h5 className="mb-0" style={{ marginLeft: "4px" }}>
                    내용
                  </h5>
                </div>
                <ReactQuill
                  ref={quillRef}
                  theme="snow"
                  value={editorContent || placeholder}
                  onChange={handleEditorChange}
                  onFocus={clearPlaceholder}
                  onBlur={handleEditorBlur}
                  modules={modules}
                  formats={formats}
                  className="content-edit mt-2"
                />
              </Form.Label>

              <div className="text-muted mb-3">
                글자수: {getTextLength()} 자
              </div>

              <div className="char2button d-flex gap-4 justify-content-center">
                <Button
                  variant="secondary"
                  type="button"
                  className="p-0"
                  onClick={() => closeEditor()}
                >
                  닫기
                </Button>
                <Button
                  variant="info"
                  type="button"
                  className="p-0"
                  onClick={() => setEditorContent("")}
                >
                  리셋
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  className="p-0"
                  style={{ cursor: "pointer" }}
                  disabled={saving}
                >
                  {saving ? <span>저장 중...</span> : "저장"}
                </Button>
              </div>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default QuestionEditor;
