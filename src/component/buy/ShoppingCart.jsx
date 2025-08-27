import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { readUserCart } from "./orderService";

const ShoppingCart = ({ optionLabels, changeCarouselShape }) => {
  const [formData, setFormData] = useState({
    items: [
      {
        isChecked: false,
        shape: "",
        count: "1",
        subTotal: 0,
      },
    ],
  });

  const [deleteIdList] = useState(new Array());

  function gotoPaymentPage() {}

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();
  function gotoOrderForm() {
    navigate("/buy_soap");
  }

  async function readCart() {
    const userId = localStorage.getItem("LOGIN_ID");
    if (userId) {
      const userCart = await readUserCart(userId);
      // 후단에서 유저의 카트 내용을 읽고, 그 결과로 formData.items 에 치환.
      console.log("items: ", userCart);
      setFormData((prevState) => ({ ...prevState, items: userCart }));
    }
  }

  useEffect(() => {
    readCart();
  }, []);

  function saveCartUpdate() {}

  return (
    <div className="order-form">
      <Form onSubmit={handleSubmit}>
        <fieldset className="field-set mb-4">
          <Form.Group className="mb-2">
            <Row className="justify-content-center mb-2">
              <Col md={2}></Col>
              <Col md={5}>
                <legend className="legend text-center">외형별 수량</legend>
              </Col>
              <Col md={2}></Col>
            </Row>
            <Row className="mt-5">
              <div
                style={{ display: "flex", gap: "20px" }}
                className="justify-content-center"
              >
                <Button
                  variant="info"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={gotoPaymentPage}
                >
                  선택 항목 주문
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={saveCartUpdate}
                >
                  변경 내용 저장
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={gotoOrderForm}
                >
                  비누 주문 하기
                </Button>
              </div>
            </Row>
          </Form.Group>
        </fieldset>
      </Form>
    </div>
  );
};

export default ShoppingCart;
