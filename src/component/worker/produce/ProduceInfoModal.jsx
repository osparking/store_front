import { Button, Modal } from "react-bootstrap";

const ProduceInfoModal = ({ show, closer }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>비누 생산 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="danger" onClick={closer}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProduceInfoModal;
