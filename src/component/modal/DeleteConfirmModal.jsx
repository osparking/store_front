import React from 'react'
import { Button, Modal } from 'react-bootstrap';

const DeleteConfirmModal = ({
    show,
    onHide,
    handleDeletion,
    target
}) => {
    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Header closeButton>
                <Modal.Title>삭제 후 복구 불가</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                '{target}' 계정 삭제는 복구불가입니다!
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    취소
                </Button>
                <Button variant="danger" onClick={handleDeletion}>
                    삭제
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default DeleteConfirmModal