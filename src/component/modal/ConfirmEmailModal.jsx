import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "../worker/WorkerDeptSelector.css";
import "./ConfirmEmailModal.css";

const ConfirmEmailModal = ({ show, closer, confirmData, dialogClass }) => {
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
        <Modal.Title>사용자 등록 결과</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-success mb-3" style={{ textAlign: "center" }}>
          회원이 성공적으로 등록되었습니다!
        </p>
        <p>인증 이메일이 {confirmData.email}로 발송되었으니,</p>
        <p>
          <b>이메일에 포함된 링크를 클릭</b>해야 계정이 활성화됩니다.
        </p>
        <p className="text-danger" style={{ textAlign: "center" }}>
          링크는 {confirmData.expireTime}까지 유효합니다.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={closer}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmEmailModal;
