import { ko } from "date-fns/locale/ko";
import { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../../common/AlertMessage";
import BsAlertHook from "../../hook/BsAlertHook";
import ShapeSelector from "../../soaps/ShapeSelector";
import ProducerModal from "./ProducerModal";
import { sendProduceInfo } from "../WorkerService";

const ProduceInfoModal = ({
  show,
  closer,
  produceInfo,
  setProduceInfo,
  setParentSuccessMsg,
  setParentAlertSuccess,
  loadProducePage,
  setCurrentPage,
}) => {
  registerLocale("ko", ko);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (readyToSubmit()) {
      var result = await sendProduceInfo(produceInfo);
      
      setParentSuccessMsg(result.message);
      setParentAlertSuccess(true);
      !produceInfo.id ? setCurrentPage(1) : loadProducePage();
      closer();
    }
  };

  const readyToSubmit = () => {
    if (produceInfo.shapeLabel === "") {
      setErrorMsg("비누 외형을 선택하세요!");
      setAlertError(true);
      return false;
    } else if (produceInfo.quantity <= 0) {
      setErrorMsg("수량은 1 이상이어야 합니다!");
      setAlertError(true);
      return false;
    } 
    return true;
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

  const [showNameModal, setShowNameModal] = useState(false);
  const [empName, setEmpName] = useState("임걱정");

  const setProducer = (producer) => {
    setProduceInfo({...produceInfo, producer: producer})
  }

  const openNameModal = () => {
    setShowNameModal(true);
  }

  return (
    <>
      <ProducerModal
        show={showNameModal}
        producer={produceInfo.producer}
        setProducer={setProducer}
        closer={() => {
          setShowNameModal(false);
        }}
      />
      <Modal show={show} onHide={closer}>
        <Modal.Header closeButton>
          <Modal.Title>비누 생산 정보</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="justify-content-center mb-5">
              <Col xs={5}>
                <Form.Group>
                  <Form.Label>생산 직원명</Form.Label>
                  <Row>
                    <Col
                      xs={8}
                      style={{
                        paddingLeft: "5px",
                        paddingRight: "2px",
                      }}
                    >
                      <Form.Control
                        type="text"
                        name="producerName"
                        value={`${produceInfo.producer.name} (${produceInfo.producer.id})`}
                        placeholder="(직원명)"
                        onChange={handleChange}
                        required
                        readOnly
                      />
                    </Col>
                    <Col xs={4} style={{ paddingLeft: "2px" }}>
                      <Button
                        variant="primary"
                        style={{
                          height: "30px",
                          maxWidth: "75px",
                          paddingTop: "1px",
                          marginTop: "4px",
                          marginRight: "5px",
                        }}
                        onClick={openNameModal}
                      >
                        <span>수정</span>
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>
              </Col>
              <Col xs={5} className="ms-3">
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
                  <Form.Label htmlFor="producedQuantity">수량</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    id="producedQuantity"
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
    </>
  );
};

export default ProduceInfoModal;
