import ko from "date-fns/locale/ko";
import { useRef, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import BuyPlaceSelector from "./BuyPlaceSelector";
import IngreNameSelector from "./IngreNameSelector";
import UnitSelector from "./UnitSelector";
import { sendStoIngInfo, updateStoredIngre } from "./WorkerService";

const IngreDataModal = ({
  show,
  closer,
  setIngreAdded,
  setIngreUpdated,
  ingredient,
  setIngredient,
}) => {
  const [storeDate, setStoreDate] = useState(new Date());
  let endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  const [expireDate, setExpireDate] = useState(endDate);

  registerLocale("ko", ko);

  const ingreNameRef = useRef(null);

  const handleReset = () => {
    setIngredient({
      ingreName: "",
      quantity: "1",
      packunit: "",
      count: "1",
      storeDate: storeDate,
      buyPlace: "",
      expireDate: expireDate,
    });
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
    switch (e.target.name) {
      case "quantity":
      case "count":
        if (isNaN(e.target.value)) {
          setErrorMsg("숫자만 입력하세요!");
          setAlertError(true);
        }
        break;
    }
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const handleStoreDate = (storeDate) => {
    setIngredient({ ...ingredient, storeDate: storeDate });
  };

  const handleExpireDate = (expireDate) => {
    setIngredient({ ...ingredient, expireDate: expireDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ingredient.ingreName || ingredient.ingreName === "") {
      // alert("[재료 명칭]을 선택하세요!");
      setErrorMsg("[재료 명칭]을 선택하세요!");
      setAlertError(true);

      if (ingreNameRef.current) {
        ingreNameRef.current.focus();
      }

      return;
    }

    try {
      let response = undefined;

      if (ingredient.id) {
        response = await updateStoredIngre(ingredient);
        setIngreUpdated(true);
      } else {
        response = await sendStoIngInfo(ingredient);
        setIngreAdded(true);
      }
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  return (
    <Modal show={show} onHide={closer}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title">입고 재료 정보</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "visible" }}>
        <Row className="justify-content-center">
          <Col xs={10} md={10} lg={10}>
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Row>
                  <Col xs={6} className="mb-2 mb-sm-0">
                    <IngreNameSelector
                      ingreName={ingredient.ingreName}
                      onChange={handleChange}
                      ref={ingreNameRef}
                    />
                  </Col>
                </Row>
              </Form.Group>
              <Form.Group as={Row} controlId="buyPlace" className="mb-1">
                <Col
                  className="mb-1 mb-sm-0"
                  style={{ minWidth: "fit-content" }}
                >
                  <BuyPlaceSelector
                    buyPlace={ingredient.buyPlace}
                    onChange={handleChange}
                    ingreName={ingredient.ingreName}
                  />
                </Col>
              </Form.Group>
              <Row className="mb-4">
                <Col xs={6} className="mb-3 mb-sm-0">
                  <Form.Group controlId="storeDate">
                    <Form.Label>입고 일자</Form.Label>
                    <DatePicker
                      id="storeDate"
                      selected={ingredient.storeDate}
                      onChange={handleStoreDate}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      maxDate={new Date()}
                      placeholderText="(입고 날짜)"
                      defaultShow={true}
                      required
                      locale="ko"
                    />
                  </Form.Group>
                </Col>
                <Col xs={6} className="mb-3 mb-sm-0">
                  <Form.Group controlId="expireDate">
                    <Form.Label>사용 기한</Form.Label>
                    <DatePicker
                      id="expireDate"
                      selected={ingredient.expireDate}
                      onChange={handleExpireDate}
                      dateFormat="yyyy-MM-dd"
                      className="form-control"
                      minDate={new Date()}
                      placeholderText="(사용기한)"
                      defaultShow={true}
                      required
                      locale="ko"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "55px",
                }}
              >
                <Col xs={2} className="mb-3 mb-sm-0">
                  <Form.Group as={Row} className="mb-1" controlId="quantity">
                    <Form.Label>용량</Form.Label>
                    <Form.Control
                      type="text" // Use "text" to gain more control over input
                      name="quantity"
                      value={ingredient.quantity}
                      onChange={handleChange}
                      inputMode="numeric" // Suggest numeric keyboard on mobile devices
                      pattern="[0-9]*" // HTML5 pattern for basic browser validation
                      style={{ flex: "1" }}
                    />
                  </Form.Group>
                </Col>
                <Col xs={3} className="mb-3 mb-sm-0">
                  <UnitSelector
                    packunit={ingredient.packunit}
                    onChange={handleChange}
                  />
                </Col>
                <Col xs={2} className="mb-3 mb-sm-0">
                  <Form.Group as={Row} className="mb-1" controlId="count">
                    <Form.Label>수량</Form.Label>
                    <Form.Control
                      type="number"
                      name="count"
                      min="1"
                      value={ingredient.count}
                      placeholder="(숫자)"
                      onChange={handleChange}
                      required
                      style={{ flex: "1" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              {ingredient.addTime && (
                <>
                  <hr style={{ marginBottom: "0" }} />
                  <Form.Group
                    as={Row}
                    className="mt-2 mb-2"
                    controlId="addTime"
                    style={{ width: "fit-content", margin: "0 auto" }}
                  >
                    <Form.Label column xs="auto" className="mb-0 px-1">
                      입력 시간:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="addTime"
                      value={ingredient.addTime}
                      onChange={handleChange}
                      readOnly
                      plaintext
                      style={{
                        paddingLeft: "4px",
                        width: "168px",
                        backgroundColor: "lightgray",
                        borderRadius: "6px",
                        textAlign: "start",
                      }}
                    />
                  </Form.Group>
                </>
              )}
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
      <Modal.Footer style={{ justifyContent: "center", padding: "2em" }}>
        <div className="d-flex justify-content-center char2button gap-3">
          <Button variant="secondary" onClick={closer} style={{ padding: 0 }}>
            닫기
          </Button>
          <Button
            variant="info"
            size="md"
            style={{ padding: 0 }}
            onClick={handleReset}
          >
            리셋
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
  );
};

export default IngreDataModal;
