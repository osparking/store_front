import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css"; // Import styles
import "../../App.css";
import "./MyQuillEditor.css";
import ConfirmationModal from "../modal/ConfirmationModal";

function MyQuillEditor({ order, handleClose, saveReview }) {
  const [editorContent, setEditorContent] = useState(order.review);
  const [loading, setLoading] = useState(false);

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(content);
  };

  const getTextLength = () => {
    let textLength = 0;

    if (editorContent) {
      const plainText = editorContent.replace(/<[^>]*>/g, "");
      textLength = plainText.trim().length;
    }
    return textLength;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (getTextLength() === 0) {
      return toast.error("후기 내용을 작성하세요!");
    }
    try {
      setLoading(true);
      const reviewData = { id: order.id, review: editorContent };

      await saveReview(reviewData);

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
  
  const confirmDeletion = () => {
    setShowModal(true);
  };

  const performDeletion = async () => {
    try {
      setLoading(true);
      const reviewData = { id: order.id, review: null };

      await saveReview(reviewData);

      toast.success("후기 삭제 완료");
      handleClose();
    } catch (err) {
      console.error("err: ", err);
      toast.error("후기 삭제 실패!");
    } finally {
      setLoading(false);
    }    
  };

  return (
    <Container className="mt-4">
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={performDeletion}
        bodyMessage="후기를 삭제하려면, 삭제 버튼을 누르십시오!"
        title="후기 삭제 확인"
        noLabel="취소"
        yesLabel="삭제"
        headerBgColor="bg-danger"
        modelClassName="modal-slide-down"
      />
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>
            <h5>{order.orderName} 구매 후기</h5>
          </Form.Label>
          <ReactQuill
            theme="snow"
            value={editorContent}
            onChange={handleEditorChange}
            modules={modules}
            formats={formats}
            placeholder="여기에 후기를 작성하세요 :-)"
            style={{
              height: "250px",
              marginBottom: "50px",
              borderRadius: "4px",
            }}
          />
        </Form.Group>

        {/* Character count (optional) */}
        <div className="text-muted mb-3">글자수: {getTextLength()} 자</div>

        <div className="d-flex gap-2 justify-content-center">
          <Button
            variant="secondary"
            type="button"
            className="px-4"
            onClick={() => handleClose()}
          >
            닫기
          </Button>
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
          {order.review && (
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
      </Form>
    </Container>
  );
}

export default MyQuillEditor;
