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
}) {
  const [editorContent, setEditorContent] = useState(order.review);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const getTextLength = () => {
    return editorContent ? getPlainContent(editorContent).length : 0;
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
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={confirmDeletion}
        bodyMessage="후기를 삭제하려면, 삭제 버튼을 누르십시오!"
        title="후기 삭제 확인"
        noLabel="취소"
        yesLabel="삭제"
        yesVariant="danger"
        headerBgColor="bg-warning"
        modelClassName="modal-slide-down"
        dialogClassName="review-deletion-confirmation-modal"
      />
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

        <div className="d-flex gap-4 justify-content-center quill-buttons char2button">
          {order.review && editable && (
            <Button
              variant="danger"
              type="button"
              className="p-0"
              disabled={loading}
              onClick={() => setShowModal(true)}
            >
              삭제
            </Button>
          )}
          <Button
            variant="secondary"
            type="button"
            className="p-0"
            onClick={() => handleClose()}
          >
            닫기
          </Button>
          {editable && (
            <>
              <Button
                variant="info"
                type="button"
                className="p-0"
                onClick={() => setEditorContent("")}
              >
                초기화
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="p-0"
                style={{ cursor: "pointer" }}
                disabled={loading}
              >
                {loading ? <span>저장 중...</span> : "저장"}
              </Button>
            </>
          )}
        </div>
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
