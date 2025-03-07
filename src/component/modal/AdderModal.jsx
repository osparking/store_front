import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";

const AdderModal = ({ show, closer, label }) => {
  const [itemValue, setItemValue] = useState("");
  const contentChanged = (e) => {
    setItemValue(e.target.value);
  };

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>새 {label} 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-1">
            <Form.Label>{label} 명</Form.Label>
            <Form.Control
              type="text"
              value={itemValue}
              placeholder={`(새 ${label.toLowerCase()} 입력)`}
              onChange={contentChanged}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AdderModal;
