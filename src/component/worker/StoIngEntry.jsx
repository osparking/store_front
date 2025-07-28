import { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import BsAlertHook from "../hook/BsAlertHook";
import BuyPlaceSelector from "./BuyPlaceSelector";
import IngreNameSelector from "./IngreNameSelector";
import { sendStoIngInfo } from "./WorkerService";

const StoIngEntry = () => {
  const [storeDate, setStoreDate] = useState(new Date());
  let expireDate = new Date();
  expireDate.setFullYear(expireDate.getFullYear() + 1);

  const [ingredient, setIngredient] = useState({
    ingreName: "가성소다",
    quantity: "1",
    packunit: "kg",
    count: "1",
    storeDate: storeDate,
    buyPlace: "https://smartstore.naver.com/vase_shop/",
    expireDate: expireDate,
  });

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
                <Form.Group as={Row} controlId="password" className="mb-4">
                  <Col className="mb-2 mb-sm-0">
                    <BuyPlaceSelector
                      buyPlace={ingredient.buyPlace}
                      onChange={handleChange}
                    />
                  </Col>
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

export default StoIngEntry;
