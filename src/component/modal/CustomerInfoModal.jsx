import { useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

const CustomerInfoModal = ({ show, onHide, customer }) => {
  useEffect(() => {
    console.dir("dir:", customer);
  }, [customer]);

  return (
    <Modal show={show} onHide={onHide} dialogClassName="recipients-modal">
      <div className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>고객 상세 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>성명: {customer?.fullName}</Modal.Body>
        <Modal.Footer className="d-flex justify-content-center align-items-center">
          <div>
            <Button variant="secondary" onClick={onHide}>
              닫기
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default CustomerInfoModal;
