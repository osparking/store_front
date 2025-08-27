import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OrderItemEntry from "./OrderItemEntry";
import { readUserCart, updateUserCart } from "./orderService";
import CartItemRow from "./CartItemRow";
import BsAlertHook from "../hook/BsAlertHook";
import AlertMessage from "../common/AlertMessage";

const ShoppingCart = ({ optionLabels, changeCarouselShape }) => {
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

  const delCartItem = (index) => {
    deleteIdList.push(formData.items[index].id);
    console.log("deleted item id list: ", deleteIdList);
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

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

  const handlePropChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];

    newItems[index][name] = value;
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  async function saveCartUpdate() {
    const convertedItems = formData.items.map((item) => {
      return { id: item.id, count: item.count };
    });
    let data = { deleteId: deleteIdList, updateCount: convertedItems };
    const result = await updateUserCart(data);
    readCart();
    setSuccessMsg("장바구니 내용이 저장되었습니다.");
    setAlertSuccess(true);
    console.log("result: ", result);
  }

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
            {formData.items.length > 0 ? (
              formData.items.map((item, index) => (
                <CartItemRow
                  key={index}
                  index={index}
                  item={item}
                  formDataItems={formData.items}
                  optionLabels={optionLabels}
                  handleInputChange={(e) => handlePropChange(index, e)}
                  changeCarouselShape={changeCarouselShape}
                  delSoapItem={delCartItem}
                />
              ))
            ) : (
              <p>장바구니가 비었습니다.</p>
            )}
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
            <Row className="mt-5 justify-content-center">
              <Col md={7}>
                {alertSuccess && (
                  <AlertMessage type={"success"} message={successMsg} />
                )}
                {alertError && (
                  <AlertMessage type={"danger"} message={errorMsg} />
                )}
              </Col>
            </Row>
          </Form.Group>
        </fieldset>
      </Form>
    </div>
  );
};

export default ShoppingCart;