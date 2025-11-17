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
import { labelsOver, setDifference } from "../util/utilities.js";
import CartPutModal from "./CartPutModal.jsx";
import OrderItemEntry from "./OrderItemEntry.jsx";

const OrderForm = ({
  optionLabels,
  defaultLabel,
  changeCarouselShape,
  setCarouselImages,
  recipient,
}) => {
  const location = useLocation();
  const { formItems } = location.state || false;

  const [formData, setFormData] = useState({
    userId: 3,
    items: [
      {
        shape: defaultLabel,
        count: "1",
      },
    ],
    orderStatus: "결재대기",
  });

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
      // 주문서에서 '뒤로' 돌아온 경우
      return;
    }
    setDisableButton(false);
    const items = [
      {
        shape: defaultLabel,
        count: "1",
        inventory:
          optionLabels.find((label) => label.optionLabel === defaultLabel)
            ?.inventory || 0,
        price: findPrice(optionLabels, defaultLabel),
      },
    ];
    setFormData((prevState) => ({
      ...prevState,
      items: items,
    }));
  }, [defaultLabel]);

  useEffect(() => {
    const allLabels = labelsOver(optionLabels, 0);
    findDefaultShape(allLabels);
  }, [optionLabels, formData.items, defaultLabel]);

  const soapPriceTotal = () => {
    return formData.items
      .reduce((total, item) => {
        if (item.shape !== "") {
          return total + item.price * item.count;
        }
        return total;
      }, 0)
      .toLocaleString();
  };

  const handlePropChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];

    // 만일 name 이 'shape' 라면, 가격도 함께 바꿔준다.
    if (name === "shape") {
      newItems[index]["price"] = findPrice(optionLabels, value);
    }
    newItems[index][name] = value;
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addSoapItem = () => {
    const newItem = {
      shape: defaultShape,
      count: "1",
      price: findPrice(optionLabels, defaultShape),
    };
    setFormData((prevState) => ({
      ...prevState,
      items: [...prevState.items, newItem],
    }));
  };

  const delSoapItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  const navigate = useNavigate();

  const cartAddResultMap = new Map();

  async function saveCart(items, userId) {
    for (const item of items) {
      try {
        const formData = new FormData();

        formData.append("userId", userId);
        formData.append("shape", item.shape);
        formData.append("count", item.count);

        const result = await callWithToken("post", "/cart/item/add", formData);

        if (result) {
          cartAddResultMap.set(
            result.data.message,
            (cartAddResultMap.get(result.data.message) || 0) + 1
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
      ([key, value]) => `${key}: ${value} 건`
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
      alert("모든 비누 외형을 선택해주세요.");
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
    showCartModal(getResultString());
  }

  const [showResultModal, setShowResultModal] = useState(false);
  const [cartModalMessage, setCartModalMessage] = useState("");

  function enterDeliveryInfo() {
    navigate("/recipient", {
      state: {
        formItems: formData.items,
        source: "orderForm",
        recipient: recipient,
      },
    });
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
              <Col md={2}>
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
            {formData.items.map((item, index) => (
              <OrderItemEntry
                key={index}
                index={index}
                item={item}
                formDataItems={formData.items}
                optionLabels={optionLabels}
                handleInputChange={(e) => handlePropChange(index, e)}
                changeCarouselShape={changeCarouselShape}
                setCarouselImages={setCarouselImages}
                canRemove={index > 0}
                delSoapItem={delSoapItem}
              />
            ))}
            <Row className="justify-content-center mb-3">
              <Col md={7} className="text-end">
                <p
                  style={{
                    margin: "5px",
                    textAlign: "right",
                  }}
                >
                  범이비누 총액
                </p>
              </Col>
              <Col md={3}>
                <p
                  style={{
                    margin: "5px 10px",
                    textAlign: "right",
                  }}
                >
                  {soapPriceTotal()} 원
                </p>
              </Col>
              <Col md={1}></Col>
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
                  onClick={putToCart}
                >
                  장바구니 담기
                </Button>
                <Button
                  variant="success"
                  size="sm"
                  className="pt-2 pb-2 order-button-width"
                  onClick={enterDeliveryInfo}
                >
                  바로 구매하기
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
