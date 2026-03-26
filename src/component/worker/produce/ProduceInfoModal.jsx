import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import AlertMessage from "../../common/AlertMessage";
import BsAlertHook from "../../hook/BsAlertHook";
import ShapeSelector from "../../soaps/ShapeSelector";

const ProduceInfoModal = ({
  show,
  closer,
  setProduceAdded,
  produceInfo,
  setProduceInfo,
}) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (produceInfo.shape === "") {
      setErrorMsg("비누 외형을 선택하세요!");
      setAlertError(true);
      return;
    }
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

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title>비누 생산 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row className="justify-content-center">
          <Col xs={5}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <ShapeSelector
                  shape={produceInfo.shape}
                  onChange={handleChange}
                />
              </Form.Group>
            </Form>
          </Col>
          <Col xs={3}>
            <Form onSubmit={handleSubmit}>
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
            </Form>
          </Col>
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
        </Row>
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
