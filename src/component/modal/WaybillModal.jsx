import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Modal } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";

export default function WaybillModal({
  show,
  handleClose,
  handleSubmit,
  getMessage,
  title,
  dialogClass = "",
}) {
  const [waybillNo, setWaybillNo] = useState("3651094543");
  const inputRef = useRef(null);

  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const saveWaybillNo = async (event) => {
    event.preventDefault();
    try {
      await handleSubmit(waybillNo);
      setAlertSuccess(true);
    } catch (error) {
      const message = error.message + "(오류코드: " + error.code + ")";
      setErrorMsg(message);
      console.error(message);
      setAlertError(true);
    }
  };

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
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      dialogClassName={dialogClass}
    >
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={saveWaybillNo}>
        <Modal.Body>
          {getMessage()}
          <Form.Group controlId="curPwd" className="mb-3 mt-3">
            <div className="d-flex align-items-center gap-2">
              <Form.Label className="mb-0 text-nowrap">
                GS25 운송장번호:
              </Form.Label>
              <Form.Control
                ref={inputRef}
                type="text"
                value={waybillNo}
                placeholder="(운송장번호)"
                name="waybillNo"
                onChange={handleChange}
                required
              />
      </div>
    </Form.Group>
          {alertError && (
            <div className="d-flex justify-content-center mt-4">
              <AlertMessage type={"danger"} message={errorMsg} />
            </div>
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="d-flex justify-content-center char2button gap-3 w-100">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="d-flex align-items-center justify-content-center"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="d-flex align-items-center justify-content-center"
            >
              등록
            </Button>
          </div>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
