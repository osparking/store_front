import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../../common/AlertMessage";
import BsAlertHook from "../../hook/BsAlertHook";
import ShapeSelector from "../../soaps/ShapeSelector";
import EmployeeNameModal from "./EmployeeNameModal";
import { ko } from "date-fns/locale/ko";

const ProduceInfoModal = ({
  show,
  closer,
  setProduceAdded,
  produceInfo,
  setProduceInfo,
}) => {
  registerLocale("ko", ko);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (produceInfo.shape === "") {
      setErrorMsg("비누 외형을 선택하세요!");
      setAlertError(true);
      return;
    }
    console.log("produce info:", produceInfo);
  };

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

  const handleChange = (e) => {
    setProduceInfo({ ...produceInfo, [e.target.name]: e.target.value });
  };

  const changeProduceDate = (produceDate) => {
    setProduceInfo({ ...produceInfo, produceDate: produceDate });
  };

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>비누 생산 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center mb-5">
            <Col xs={3}>
              <Form.Group>
                <Form.Label>생산자</Form.Label>
                <Form.Control
                  type="text"
                  name="producerName"
                  value={produceInfo.producerName}
                  placeholder="숫자"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col xs={5}>
              <Form.Group>
                <Form.Label>생산 일자</Form.Label>
                <DatePicker
                  selected={produceInfo.produceDate}
                  onChange={changeProduceDate}
                  dateFormat="yyyy-MM-dd"
                  className="form-control"
                  maxDate={new Date()}
                  placeholderText="(생산일)"
                  defaultShow={true}
                  required
                  locale="ko"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={5}>
              <Form.Group>
                <ShapeSelector
                  shapeLabel={produceInfo.shapeLabel}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col xs={3}>
              <Form.Group>
                <Form.Label>수량</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  min="1"
                  value={produceInfo.quantity}
                  placeholder="숫자"
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="justify-content-center" style={{ margin: "auto" }}>
            <Col xs={10} md={8}>
              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}
              {alertSuccess && (
                <AlertMessage severity={"success"} message={successMsg} />
              )}
            </Col>
          </Row>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleSubmit}>
          저장
        </Button>
        <Button variant="danger" onClick={closer}>
          닫기
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProduceInfoModal;
