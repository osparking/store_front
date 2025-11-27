import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";

export default function WaybillModal({
  show,
  handleClose,
  handleSubmit,
  getMessage,
  title,
}) {
  const [waybillNo, setWaybillNo] = useState("3631317740");
  const inputRef = useRef(null);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [show]);

  const handleChange = (e) => {
    setWaybillNo(e.target.value);
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {getMessage()}
        <Form onSubmit={() => handleSubmit(waybillNo)}>
          <Form.Group controlId="curPwd">
            <Form.Label>GS25 운송장번호: 363131774074</Form.Label>
            <InputGroup>
              <Form.Control
                ref={inputRef}
                type="text"
                value={waybillNo}
                placeholder="(운송장번호)"
                name="waybillNo"
                onChange={handleChange}
                required
              />
            </InputGroup>
          </Form.Group>

          <div className="d-flex justify-content-center mt-4">
            <div className="mx-2">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-3"
              >
                취소
              </Button>
              <Button type="submit" variant="primary">
                등록
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
