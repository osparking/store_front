import { Button, Col, Form, Modal, Row } from "react-bootstrap";
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
          <Col xs={8}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <ShapeSelector
                  shape={produceInfo.shape}
                  onChange={handleChange}
                />
              </Form.Group>
              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}

              {alertSuccess && (
                <AlertMessage severity={"success"} message={successMsg} />
              )}
            </Form>
          </Col>
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
