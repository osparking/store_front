import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "../../../App.css";
import ConfirmationModal from "../../modal/ConfirmationModal";
import { getPlainContent } from "../../util/utilities";
import { deleteFollowUp } from "./QuestionService";

function FollowUpEditor({
  questionId,
  followUp,
  handleClose,
  saveAnswer,
  editable,
  setReloadPage,
  headText,
}) {
  console.log("followUp: ", JSON.stringify(followUp));
  const [editorContent, setEditorContent] = useState(followUp.content);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const getTextLength = () => {
    if (!editorContent) return 0;

    const plainContent = getPlainContent(editorContent);
    return plainContent === promptMessage ? 0 : plainContent.length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTextLength() === 0) {
      return toast.error("답변을 작성하세요!");
    }
    try {
      setLoading(true);
      const answerData = {
        id: followUp?.id ?? 0,
        content: editorContent,
        questionId: questionId,
        userId: followUp.userId,
      };

      await saveAnswer(answerData);

      toast.success("답변 저장 성공.");
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("답변 저장 오류!");
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

  const [showModal, setShowModal] = useState(false);

  const confirmDeletion = () => {
    setShowModal(true);
  };

  const performDeletion = async () => {
    try {
      setLoading(true);

      await deleteFollowUp(followUp.id);

      toast.success("댓글 삭제 완료");
      setReloadPage(true);
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("댓글 삭제 실패!");
    } finally {
      setLoading(false);
    }
  };

  const promptMessage = `(${headText} 입력)`;
  const [placeholder, setPlaceholder] = useState(promptMessage);

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

  const quillRef = useRef(null); // Reference for the ReactQuill instance

  const h5ref = useRef(null); // 퀼 편집기 위 h5 헤딩 참조자
  useEffect(() => {
    // 성분 열릴 때, h5 헤딩에 촛점 부여
    if (h5ref.current) {
      h5ref.current.focus();
    }
  }, []);

  const handleHeadingClick = () => {
    if (quillRef.current) {
      // h5 텍스트 클릭 때, 퀼 편집기로 촛점 이동
      quillRef.current.focus();
    }
  };

  const handleHeadingKeyDown = (e) => {
    // 성분 열린 뒤, 엔터/공백 클릭하면, 퀼 편집기 상자로 촛점 이동
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (quillRef.current) {
        quillRef.current.focus();
      }
    }
  };

  return (
    <>
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={performDeletion}
        bodyMessage="댓글을 삭제하려면, 삭제 버튼을 누르십시오!"
        title="댓글 삭제 확인"
        noLabel="취소"
        yesLabel="삭제"
        headerBgColor="bg-danger"
        modelClassName="modal-slide-down"
      />
      <Form className="mt-3 ms-3 mb-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3 me-3">
          <h5
            ref={h5ref}
            onClick={handleHeadingClick}
            onKeyDown={handleHeadingKeyDown}
            style={{ textAlign: "left", cursor: "pointer" }}
            className="mb-2"
            tabIndex="0" // 탭이동 순서에 포함, 포커스 지정 가능
            role="button" // 클릭 가능한 버튼으로 취급 지정
          >
            {headText}
          </h5>
          <ReactQuill
            id="bumAnswer"
            ref={quillRef}
            theme="snow"
            value={editorContent || placeholder}
            onChange={handleEditorChange}
            onFocus={clearPlaceholder}
            onBlur={handleEditorBlur}
            modules={modules}
            formats={formats}
            style={{
              marginBottom: "10px",
              borderRadius: "4px",
            }}
            className="ms-3 me-2"
          />
        </Form.Group>
        <div className="d-flex gap-2 justify-content-center ">
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
            </>
          )}
          {followUp.content && editable && (
            <Button
              variant="danger"
              type="button"
              className="px-4"
              disabled={loading}
              onClick={confirmDeletion}
            >
              삭제
            </Button>
          )}
        </div>
        <hr style={{ color: "blue" }} />
      </Form>
    </>
  );
}

export default FollowUpEditor;
