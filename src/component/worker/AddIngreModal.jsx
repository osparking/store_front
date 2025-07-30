import ko from "date-fns/locale/ko";
import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import BuyPlaceSelector from "./BuyPlaceSelector";
import IngreNameSelector from "./IngreNameSelector";
import UnitSelector from "./UnitSelector";
import { sendStoIngInfo } from "./WorkerService";

const AddIngreModal = ({ show, closer, setIngreAdded }) => {
  const [storeDate, setStoreDate] = useState(new Date());
  let endDate = new Date();
  endDate.setFullYear(endDate.getFullYear() + 1);
  const [expireDate, setExpireDate] = useState(endDate);

  registerLocale("ko", ko);

  const [ingredient, setIngredient] = useState({
    ingreName: "가성소다",
    quantity: "1",
    packunit: "kg",
    count: "1",
    storeDate: storeDate,
    buyPlace: "https://smartstore.naver.com/vase_shop/",
    expireDate: expireDate,
  });

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
    try {
      const response = await sendStoIngInfo(ingredient);
      console.log("response: ", response);
      setSuccessMsg(response.message);
      setAlertSuccess(true);
    } catch (error) {
      console.log("error.response: ", error.response);
      setErrorMsg(error.response.data.message);
      setAlertError(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form onSubmit={handleSubmit}>
            <Card className="shadow mb-5">
              <Card.Header className="text-center">
                입고된 재료 정보
              </Card.Header>
              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}
              <Card.Body>
                <Form.Group>
                  <Row>
                    <Col xs={6} className="mb-2 mb-sm-0">
                      <IngreNameSelector
                        ingreName={ingredient.ingreName}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
                <Form.Group as={Row} controlId="buyPlace" className="mb-1">
                  <Col className="mb-1 mb-sm-0">
                    <BuyPlaceSelector
                      buyPlace={ingredient.buyPlace}
                      onChange={handleChange}
                    />
                  </Col>
                </Form.Group>
                <Form.Group as={Row} controlId="twoDates" className="mb-4">
                  <Row>
                    <Col xs={6} className="mb-3 mb-sm-0">
                      <Form.Label>입고 일자</Form.Label>
                      <DatePicker
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
                    </Col>
                    <Col xs={6} className="mb-3 mb-sm-0">
                      <Form.Label>사용 기한</Form.Label>
                      <DatePicker
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
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group as={Row} className="mb-1">
                  <Row>
                    <Col xs={4} className="mb-3 mb-sm-0">
                      <Form.Label>용량</Form.Label>
                      <Form.Control
                        type="text" // Use "text" to gain more control over input
                        name="quantity"
                        value={ingredient.quantity}
                        onChange={handleChange}
                        inputMode="numeric" // Suggest numeric keyboard on mobile devices
                        pattern="[0-9]*" // HTML5 pattern for basic browser validation
                      />
                    </Col>
                    <Col xs={4} className="mb-3 mb-sm-0">
                      <UnitSelector
                        packunit={ingredient.packunit}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col xs={4} className="mb-3 mb-sm-0">
                      <Form.Label>수량</Form.Label>
                      <Form.Control
                        type="text" // Use "text" to gain more control over input
                        name="count"
                        value={ingredient.count}
                        onChange={handleChange}
                        inputMode="numeric" // Suggest numeric keyboard on mobile devices
                        pattern="[0-9]*" // HTML5 pattern for basic browser validation
                      />
                    </Col>
                  </Row>
                </Form.Group>

                <div className="d-flex justify-content-center mb-3 mt-3">
                  <Button
                    type="submit"
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                  >
                    등록
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddIngreModal;
