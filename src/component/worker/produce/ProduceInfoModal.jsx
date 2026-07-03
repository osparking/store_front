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
  changePage,
}) => {
  registerLocale("ko", ko);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (readyToSubmit()) {
      var result = await sendProduceInfo(produceInfo);

      setParentSuccessMsg(result.message);
      setParentAlertSuccess(true);
      !produceInfo.id ? changePage(1) : loadProducePage();
      closer();
    }
  };

  const readyToSubmit = () => {
    if (produceInfo.shapeLabel === "") {
      setErrorMsg("비누 외형을 선택하세요!");
      setAlertError(true);
      return false;
    } else if (produceInfo.quantity <= 0) {
      setErrorMsg("수량은 0 보다 커야 됩니다!");
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
          <Modal.Title style={{ color: "black" }}>생산 정보 입력</Modal.Title>
        </Modal.Header>
        <Modal.Body
          id="new-produce-body"
          style={{
            padding: "1em 2em",
            height: "fit-content",
            overflow: "visible",
          }}
        >
          <Form onSubmit={handleSubmit}>
            <div className={styles.formContainer}>
              {/* First Row: 생산일자 및 비누외형 */}
              <div className={styles.firstRow}>
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

                <ShapeSelector
                  shapeLabel={produceInfo.shapeLabel}
                  onChange={handleChange}
                />
              </div>

              {/* Second Row: 직원명 및 생산수량 */}
              <div className={styles.secondRow} style={{ marginBottom: "0" }}>
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
                    <div className="char2button">
                      <Button
                        variant="success"
                        className={styles.editButton}
                        onClick={openNameModal}
                        style={{ marginTop: 0 }}
                      >
                        <span>수정</span>
                      </Button>
                    </div>
                  </div>
                </Form.Group>
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
        <Modal.Footer style={{ justifyContent: "center", padding: "2em" }}>
          <div className="d-flex justify-content-center char2button gap-3">
            <Button variant="secondary" onClick={closer} style={{ padding: 0 }}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              style={{ padding: 0 }}
            >
              저장
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProduceInfoModal;
