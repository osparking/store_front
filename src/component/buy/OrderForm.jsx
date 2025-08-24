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
import { labelsOver, setDifference } from "../util/utilities.js";
import OrderItemEntry from "./OrderItemEntry.jsx";
import { callWithToken } from "../util/api.js";
import { useNavigate } from "react-router-dom";

const OrderForm = ({ optionLabels, defaultLabel, changeCarouselShape }) => {
  const [formData, setFormData] = useState({
    userId: 3,
    items: [
      {
        shape: "",
        count: "1",
      },
    ],
    recipRegiReq: {
      addressDetail: "1001동 1503호",
      doroZbun: "지번",
      addrBasisAddReq: {
        zipcode: "12915",
        roadAddress:
          "경기도 하남시 미사강변서로 127 (망월동, 미사강변센텀팰리스(CentumPalace)) " +
          "1801동~1817동",
        zBunAddress:
          "경기도 하남시 망월동 1050 (미사강변센텀팰리스(CentumPalace))",
      },
      mbPhone: "010-1111-2222",
      fullName: "홍길동",
    },
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

    setFormData((prevState) => ({ ...prevState, items: items }));
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

  function putToCart() {
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
    console.log("장바구니에 담 비누 정보:", cartItems);
    cartItems.forEach(async (item) => {
      try {
        const formData = new FormData();

        formData.append("userId", userId);
        formData.append("shape", item.shape);
        formData.append("count", item.count);

        const result = await callWithToken("post", "/cart/item/add", formData);

        if (result) {
          return result.data;
        } else {
          navigate("/login");
        }
      } catch (err) {
        throw err;
      }
    });
  }

  function gotoPaymentPage() {}

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
                  onClick={gotoPaymentPage}
                >
                  바로 구매하기
                </Button>
              </div>
            </Row>
          </Form.Group>
        </fieldset>
      </Form>
    </div>
  );
};

export default OrderForm;
