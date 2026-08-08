import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { useLocation, useNavigate } from "react-router-dom";
import { callWithToken } from "../util/api.js";
import { getSubTotal, labelsOver, setDifference } from "../util/utilities.js";
import CartPutModal from "./CartPutModal.jsx";
import OrderTable from "./form/OrderTable.jsx";
import { useOrderDataStore } from "./orderDataStore.js";

const OrderForm = ({
  optionLabels,
  defaultLabel,
  changeCarouselShape,
  setCarouselImages,
  recipient,
}) => {
  const location = useLocation();
  const { formItems, isDefaultRecipient } = location.state || false;

  const { formData, setFormData } = useOrderDataStore();
  const [subTotal, setSubTotal] = useState({ count: 0, price: 0 });

  useEffect(() => {
    const newSubTotal = getSubTotal(formData.items);
    setSubTotal(newSubTotal);
  }, [formData.items]);

  const [disableButton, setDisableButton] = useState(false);
  const [defaultShape, setDefaultShape] = useState();

  const findDefaultShape = (allLabels) => {
    const listedLabels = new Set(formData.items.map((label) => label.shape));
    const notListedLabels = setDifference(allLabels, listedLabels);

    if (notListedLabels.length === 0) {
      setDisableButton(true);
    } else {
      setDisableButton(false);
      setDefaultShape(notListedLabels[0]);
    }
  };

  function findPrice(labels, targetLabel) {
    return (
      labels.find((label) => label.optionLabel === targetLabel)?.price || 0
    );
  }

  const defaultItems = [
    {
      shape: defaultLabel,
      count: "3",
      inventory:
        optionLabels.find((label) => label.optionLabel === defaultLabel)
          ?.inventory || 0,
      price: findPrice(optionLabels, defaultLabel),
    },
  ];

  useEffect(() => {
    if (!defaultLabel || formData.items.length > 0) {
      return;
    }
    setDisableButton(false);
    setFormData({
      items: defaultItems,
    });
  }, [defaultLabel]);

  useEffect(() => {
    const allLabels = labelsOver(optionLabels, 0);
    findDefaultShape(allLabels);
  }, [optionLabels, formData.items, defaultLabel]);

  const handlePropChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = formData.items.map((item, i) => {
      if (i !== index) return item; // 해당 인덱스가 아니면 그대로 반환

      // 해당 인덱스라면 새 객체 생성
      const updatedItem = { ...item, [name]: value };
      if (name === "shape") {
        updatedItem.price = findPrice(optionLabels, value);
      }
      return updatedItem;
    });
    setFormData({ items: newItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addSoapItem = () => {
    const newItem = {
      shape: defaultShape,
      count: "1",
      inventory:
        optionLabels.find((label) => label.optionLabel === defaultLabel)
          ?.inventory || 0,
      price: findPrice(optionLabels, defaultShape),
    };
    setFormData({
      items: [...formData.items, newItem],
    });
  };

  const delSoapItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ items: newItems });
  };

  const navigate = useNavigate();

  const cartAddResultMap = new Map();

  async function saveCart(items, userId) {
    for (const item of items) {
      try {
        const payload = {
          userId: userId,
          shape: item.shape,
          count: item.count,
        };

        const result = await callWithToken("post", "/cart/item/add", payload);

        if (result) {
          cartAddResultMap.set(
            result.data.message,
            (cartAddResultMap.get(result.data.message) || 0) + 1,
          );
        } else {
          navigate("/login");
        }
      } catch (err) {
        throw err;
      }
    }
  }

  function getResultString() {
    const resultString = Array.from(
      cartAddResultMap,
      ([key, value]) => `${key}: ${value} 건`,
    );
    return resultString;
  }

  const showCartModal = (content) => {
    setCartModalMessage(content);
    setShowResultModal(true);
  };

  async function putToCart() {
    if (formData.items.length === 0) {
      alert("비누 외형을 선택해주세요.");
      return;
    }
    if (formData.items.some((item) => item.shape === "")) {
      alert("비누 외형을 선택해주세요.");
      return;
    }
    if (formData.items.some((item) => parseInt(item.count) < 1)) {
      alert("비누 수량은 최소 1개 이상이어야 합니다.");
      return;
    }

    // 장바구니에 담는 로직
    const cartItems = formData.items.map((item) => ({
      shape: item.shape.substring(0, item.shape.indexOf("(")),
      count: item.count,
    }));
    const userId = localStorage.getItem("LOGIN_ID") || "0";

    await saveCart(cartItems, userId);
    // 장바구니에 담았으니, 주문 폼에는 기본 외형 행만 남김
    setFormData({ items: defaultItems });
    showCartModal(getResultString());
  }

  const [showResultModal, setShowResultModal] = useState(false);
  const [cartModalMessage, setCartModalMessage] = useState("");

  function enterDeliveryInfo() {
    navigate("/recipient", {
      state: {
        formItems: formData.items,
        subTotal: subTotal,
        source: "orderForm",
        recipient: recipient,
        wasDefaultRecipient: isDefaultRecipient,
      },
    });
  }

  function notReadyToPay() {
    /**
     * 구매 수량이 3 혹은 12일 때, 구매 가능
     */
    const wrongCount = subTotal?.count !== 3 && subTotal?.count !== 12;

    // 모든 원소의 shape 속성이 빈 문자열이 아닌지 검사
    const emptyShape = formData.items.some((item) => item.shape === "");

    return wrongCount || emptyShape;
  }

  return (
    <div className="order-form">
      <Form onSubmit={handleSubmit}>
        <fieldset className="field-set">
          <Form.Group className="mb-2">
            <Row className="justify-content-center mb-2">
              <Col xs={2} md={2}></Col>
              <Col xs={5} md={5}>
                <legend className="legend text-center">외형별 수량</legend>
              </Col>
              <Col xs={2} md={2}>
                <OverlayTrigger overlay={<Tooltip>외형 추가</Tooltip>}>
                  <Button
                    style={{ padding: "0 .5rem .2rem" }}
                    className="btn btn-sm btn-primary me-1"
                    onClick={addSoapItem}
                    disabled={false || disableButton}
                  >
                    <BsPlusSquareFill />
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
            <hr style={{ marginTop: "-5px" }} />
            <OrderTable
              orderItems={formData.items}
              subTotal={subTotal}
              optionLabels={optionLabels}
              handleInputChange={handlePropChange}
              changeCarouselShape={changeCarouselShape}
              delSoapItem={delSoapItem}
            />
            <Row className="justify-content-center">
              <Col xs="auto">
                <p className="small mb-0 fw-bold text-danger">
                  *수량 소계가 3 혹은 12일 때, 구매 가능합니다.
                </p>
              </Col>
            </Row>
            <Row className="mt-3">
              <div className="d-flex justify-content-center gap-4">
                <Button
                  variant="success"
                  size="sm"
                  className="order-button-width"
                  onClick={() =>
                    navigate("/shopping_cart", { state: { showCart: true } })
                  }
                >
                  바구니 보기
                </Button>
                <Button
                  variant="info"
                  size="sm"
                  className="order-button-width"
                  onClick={putToCart}
                >
                  바구니 담기
                </Button>
                <Button
                  variant="primary"
                  disabled={notReadyToPay()}
                  size="sm"
                  className="order-button-width"
                  onClick={enterDeliveryInfo}
                >
                  바로 구매
                </Button>
              </div>
            </Row>
          </Form.Group>
        </fieldset>
      </Form>

      <CartPutModal
        show={showResultModal}
        closer={() => {
          setShowResultModal(false);
          cartAddResultMap.clear();
        }}
        getResultString={cartModalMessage}
      />
    </div>
  );
};

export default OrderForm;
