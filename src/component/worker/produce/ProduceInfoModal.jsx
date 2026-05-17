import { ko } from "date-fns/locale/ko";
import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../../common/AlertMessage";
import BsAlertHook from "../../hook/BsAlertHook";
import "../../modal/BumModal.css";
import ShapeSelector from "../../soaps/ShapeSelector";
import { sendProduceInfo } from "../WorkerService";
import styles from "./ProduceInfoModal.module.css";
import ProducerModal from "./ProducerModal";

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
    setProduceInfo({ ...produceInfo, producer: producer });
  };

  const openNameModal = () => {
    setShowNameModal(true);
  };

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
      <Modal
        show={show}
        onHide={closer}
        id="new-produce"
        dialogClassName="bum-modal-size"
      >
        <Modal.Header closeButton>
          <Modal.Title>생산 정보 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "2em" }}>
          <Form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              {/* First Row: Producer Name + Produce Date */}
              <div className={styles.firstRow}>
                <Form.Group controlId="producerName">
                  <Form.Label>생산 직원명</Form.Label>
                  <div className={styles.buttonWrapper}>
                    <Form.Control
                      type="text"
                      name="producerName"
                      value={`${produceInfo.producer.name} (${produceInfo.producer.id})`}
                      placeholder="(직원명)"
                      onChange={handleChange}
                      required
                      readOnly
                      className={styles.producerInput}
                    />
                    <Button
                      variant="primary"
                      className={styles.editButton}
                      onClick={openNameModal}
                    >
                      <span>수정</span>
                    </Button>
                  </div>
                </Form.Group>

                <Form.Group controlId="produceDate">
                  <Form.Label>생산 일자</Form.Label>
                  <DatePicker
                    id="produceDate"
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
              </div>

              {/* Second Row: Shape Selector + Quantity */}
              <div className={styles.secondRow} style={{ marginBottom: "0" }}>
                <ShapeSelector
                  shapeLabel={produceInfo.shapeLabel}
                  onChange={handleChange}
                />

                <Form.Group controlId="producedQuantity" className="me-3">
                  <Form.Label>수량</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    min="1"
                    value={produceInfo.quantity}
                    placeholder="숫자"
                    onChange={handleChange}
                    required
                    className={styles.quantityInput}
                  />
                </Form.Group>
              </div>

              {/* Alert Messages Row */}
              <div className={styles.alertRow} style={{ marginTop: "0" }}>
                <div
                  className={styles.alertContent}
                  style={{ marginBottom: "0" }}
                >
                  {alertError && (
                    <AlertMessage type={"danger"} message={errorMsg} />
                  )}
                  {alertSuccess && (
                    <AlertMessage severity={"success"} message={successMsg} />
                  )}
                </div>
              </div>
            </div>
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
