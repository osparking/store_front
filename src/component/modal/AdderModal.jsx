import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../worker/WorkerDeptSelector.css";

const AdderModal = ({ show, closer, label, saver, dialogClass }) => {
  const [itemValue, setItemValue] = useState("");
  const contentChanged = (e) => {
    setItemValue(e.target.value);
  };
  const handle추가 = () => {
    saver(itemValue);
    setItemValue("");
    closer();
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName={dialogClass}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">새 {label} 추가</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-1">
            <Form.Label>{label} 명</Form.Label>
            <Form.Control
              type="text"
              value={itemValue}
              placeholder={`(새 ${label} 이름)`}
              onChange={contentChanged}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center char2button gap-2">
        <Button className="p-0" variant="secondary" onClick={closer}>
          닫기
        </Button>
        <Button className="p-0" variant="primary" onClick={handle추가}>
          추가
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdderModal;
