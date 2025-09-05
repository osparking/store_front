import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import CartItemRow from "./CartItemRow";
import { readUserCart, updateUserCart } from "./orderService";
import { handlePropChange } from "../util/utilities";

const ShoppingCart = ({ optionLabels, setCarouselImages }) => {
  const location = useLocation();
  const { formItems } = location.state || false;

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
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    setSelectedItems(formData.items.filter((item) => item.isChecked));
  }, [formData]);

  function enterDeliveryInfo() {
    navigate("/recepient", {
      state: { formItems: formData.items, source: "shoppingCart" } },
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const navigate = useNavigate();
  function gotoOrderForm() {
    navigate("/buy_soap");
  }

  const [cartInDB, setCartInDB] = useState([]);

  function countsAreEqual(itemsCart) {
    if (cartInDB.length !== itemsCart.length) {
      return false;
    }

    return cartInDB.every((item, index) => {
      return item["count"] === itemsCart[index]["count"];
    });
  }

  async function readCart(userCart) {
    if (userCart === undefined) {
      const userId = localStorage.getItem("LOGIN_ID");
      if (userId) {
        userCart = await readUserCart(userId);
      }
    }
    if (userCart) {
      // 변경 여부 판단을 위하여 수량 값만 배열로 저장
      setCartInDB(
        userCart.map((item) => {
          return { count: item.count };
        })
      );

      // 각 요소에 isChecked 멤버 추가
      const cartItems = userCart.map((item) => ({
        ...item,
        isChecked: false,
      }));

      // 후단에서 유저의 카트 내용을 읽고, 그 결과로 formData.items 에 치환.
      setFormData((prevState) => ({ ...prevState, items: cartItems }));
    }
  }

  useEffect(() => {
    if (formItems) {
      setFormData((prevState) => ({
        ...prevState,
        items: formItems,
      }));
    }
  }, [formItems]);

  useEffect(() => {
    if (formItems) {
      return; // 주문에서 '뒤로' 돌아온 경우
    }
    readCart();
  }, []);
  
  async function saveCartUpdate() {
    const convertedItems = formData.items.map((item) => {
      return { id: item.id, count: item.count };
    });
    let data = { deleteId: deleteIdList, updateCount: convertedItems };
    const result = await updateUserCart(data);
    
    readCart(result);
    setSuccessMsg("장바구니 내용이 저장되었습니다.");
    setAlertSuccess(true);
  }

  function cancelCartUpdate() {
    readCart();
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
                  optionLabels={optionLabels}
                  handleInputChange={(e) =>
                    handlePropChange(e, setFormData, index)
                  }
                  setCarouselImages={setCarouselImages}
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
                  onClick={enterDeliveryInfo}
                  disabled={selectedItems.length === 0}
                >
                  선택 주문
                </Button>
                <Button
                  variant="warning"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={saveCartUpdate}
                  disabled={countsAreEqual(formData.items)}
                >
                  변경 저장
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={cancelCartUpdate}
                  disabled={countsAreEqual(formData.items)}
                >
                  변경 취소
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={gotoOrderForm}
                >
                  비누 주문
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
