import React from 'react';
import { Modal } from 'react-bootstrap';

const AdderModal = ({ show, closer, label }) => {
  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>새 {label} 추가</Modal.Title>
      </Modal.Header>
    </Modal>
  );
};

export default AdderModal
