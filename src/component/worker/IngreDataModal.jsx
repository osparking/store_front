import ko from "date-fns/locale/ko";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
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
  savedIngredient,
  setSavedIngredient,
}) => {
  const ingredientUnchanged = () => {
    if (savedIngredient) {
      return _.isEqual(ingredient, savedIngredient);
    } else {
      return true; // savedIngredient 부재 = 변경되지 않은 것
    }
  };

  registerLocale("ko", ko);

  const ingreNameRef = useRef(null);

  const handleReset = () => {
    setIngredient({ ...savedIngredient });
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
    setIngredient({ ...ingredient, [e.target.name]: e.target.value });
  };

  const changeCount = (e) => {
    const { name, value } = e.target;

    // 숫자만 남기고 모두 제거
    const trimmedValue = value.trim();
    const numValue = value.replace(/\D/g, "");
    if (trimmedValue.length > numValue.length) {
      setErrorMsg("숫자만 입력 가능합니다!");
      setAlertError(true);
      return;
    }

    // 빈 문자열이면 그대로 허용 (사용자가 지울 수 있도록)
    if (numValue === "") {
      setIngredient({ ...ingredient, [name]: numValue });
      return;
    }

    // 숫자로 변환하여 최소값 검사 (min="1" 적용)
    const number = parseInt(numValue, 10);

    if (number >= 1) {
      setIngredient({ ...ingredient, [name]: numValue });
      setErrorMsg(""); // 에러 메시지 초기화 (선택)
      setAlertError(false);
    } else {
      setErrorMsg("1 이상의 숫자를 입력하세요!");
      setAlertError(true);
      // 유효하지 않으면 이전 값 유지하거나, 1로 강제 설정할 수도 있음
      // 여기서는 변경하지 않음 (사용자가 직접 수정하도록)
    }
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
      setSavedIngredient({ ...ingredient }); // saved 값 갱신
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  const someItemEmpty = () => {
    const allSet =
      ingredient.buyPlace &&
      ingredient.ingreName &&
      ingredient.quantity &&
      ingredient.packunit &&
      ingredient.count &&
      ingredient.storeDate &&
      ingredient.buyPlace &&
      ingredient.expireDate;

    return !allSet;
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
                      placeholder="(숫자)"
                      onChange={changeCount}
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
                      type="text" // number → text 변경
                      name="count"
                      inputMode="numeric" // 모바일에서 숫자 키패드 제공
                      pattern="[0-9]*" // (선택) HTML5 유효성 검사 힌트
                      value={ingredient.count}
                      placeholder="(숫자)"
                      onChange={changeCount}
                      required
                      style={{ flex: "1" }}
                    />
                  </Form.Group>
                </Col>
              </Row>
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
          <Button
            variant="secondary"
            onClick={closer}
            style={{ padding: 0, cursor: "pointer" }}
          >
            닫기
          </Button>
          <Button
            variant="info"
            size="md"
            style={{ padding: 0, cursor: "pointer" }}
            disabled={ingredientUnchanged()}
            onClick={handleReset}
          >
            리셋
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            style={{ padding: 0, cursor: "pointer" }}
            disabled={someItemEmpty() || ingredientUnchanged()}
          >
            저장
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default IngreDataModal;
