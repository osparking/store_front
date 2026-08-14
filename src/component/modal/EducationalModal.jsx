import { useEffect, useRef, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import "./EducationalModal.css";

export default function EducationalModal({
  show,
  hours,
  handleClose,
  setHideCheckBox,
}) {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName="eduModalDialog"
    >
      <Modal.Header closeButton>
        <Modal.Title>실 구매 불가 알림</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          <span className="strong">이 사이트는 실습용</span>으로 개발된 것으로,
          <br />
          상품 주문, 결제, 배송은 모의로 수행됩니다.
          <br />
          따라서,{" "}
          <span className="strong">
            비누의 실 구매는 <span style={{ color: "red" }}>불가능</span>
          </span>
          합니다
        </p>
        <Form.Group controlId="curPwd" className="mb-0 mt-2">
          <div className="d-flex justify-content-center">
            <Form.Check
              id="default-recipient-checkbox"
              type="checkbox"
              name="isDefaultRecipient"
              label={`${hours} 시간 알림 숨김`}
              onChange={(e) => setHideCheckBox(e.target.checked)}
            />
          </div>
        </Form.Group>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-center char2button w-100">
          <Button
            variant="primary"
            onClick={handleClose}
            className="d-flex align-items-center justify-content-center"
          >
            확인
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}
