import React from "react";
import { Button, Modal } from "react-bootstrap";
import "./DeleteConfirmModal.css"

const DeleteWorkerConfirmModal = ({
  show,
  onHide,
  handleDeletion,
  target,
  disabled,
  isPageLastItem = false,
  modalClass = "",
}) => {
  return (
    <Modal show={show} onHide={onHide} dialogClassName={modalClass}>
      <Modal.Header className="bg-warning" closeButton>
        <Modal.Title>직원 계정 삭제 효과</Modal.Title>
      </Modal.Header>
      <Modal.Body>'{target}' 직원 계정을 삭제하면,
        <ul>
          <li>계정 로그인 시도는 오류 처리되며,</li>
          <li>이메일은 새 계정 등록에 사용될 수 없고,</li>
          <li>계정의 복원은 DB 직접 수정으로만 가능합니다.</li>
        </ul>         

      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          삭제 취소
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDeletion(isPageLastItem)}
          disabled={disabled}
        >
          {disabled ? "진행 중~" : "삭제 진행"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteWorkerConfirmModal;
