import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Form, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import CheckoutCart from "./CheckoutCart";
import { getDeliveryFee } from "./orderService";
import "./recepient.css";
import RecepientInfo from "./RecepientInfo";

const Recepient = () => {
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

  const location = useLocation();
  const { formItems, source } = location.state || [];
  let productList = undefined;

  // source 에 따라 productList 를 다르게 만들어 배정
  if (source === "shoppingCart") {
    productList = formItems
      .filter((item) => item.isChecked)
      .map((item) => {
        return {
          count: item.count,
          shapeLabel: item.shapeLabel,
          subTotal: item.subTotal,
        };
      });
  } else if (source) {
    // formItems 각 항목에 shapeLabel 과 subTotal 추가
    productList = formItems.map((item) => {
      const paren = item.shape.indexOf("(");
      return {
        count: item.count,
        shapeLabel: item.shape.slice(0, paren),
        subTotal: item.count * item.price,
      };
    });
  }

  const calcGrandTotal = (productList) => {
    if (productList === undefined) return "";

    const grand = productList
      .map((prod) => prod.subTotal)
      .reduce((sum, num) => sum + num, 0);
    return grand;
  };

  const [grandTotal] = useState(calcGrandTotal(productList));

  const [formData, setFormData] = useState({
    addressDetail: "1001동 1503호",
    doroZbun: "지번",
    addrBasisAddReq: {
      zipcode: "12915",
      roadAddress:
        "경기도 하남시 미사강변서로 127 (망월동, 미사강변센텀팰리스(CentumPalace)) " +
        "1801동~1817동",
      zbunAddress:
        "경기도 하남시 망월동 1050 (미사강변센텀팰리스(CentumPalace))",
    },
    mbPhone: "010-1234-5678",
    fullName: "홍길동",
  });

  const gotoPayment = async (e) => {
    e.preventDefault();
    // 현재까지 수집된 주문 정보를 일단 저장
    const userId = localStorage.getItem("LOGIN_ID");
    const items = productList.map((item) => ({
      shape: item.shapeLabel,
      count: item.count,
    }));

    const orderData = {
      userId: userId,
      items: items,
      recipRegiReq: formData,
      orderStatus: "결제대기",
      orderName: items[0].shape + " " + items[0].count + "개 등",
    };

    // 결제 창 표시 정보 수집
    //  - 상품 총액, 배송비
    const zipcode = orderData.recipRegiReq.addrBasisAddReq.zipcode;
    const result = await getDeliveryFee({
      zipcode: zipcode,
      grandTotal: grandTotal,
    });
    const deliveryFee = result.data;

    const paymentData = {
      ...orderData,
      productTotal: grandTotal,
      deliveryFee: deliveryFee,
      paymentFee: grandTotal + deliveryFee,
    };

    navigate("/payment", {
      state: { paymentData: paymentData },
    });
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (productList === undefined) {
      navigate("/buy_soap");
    }
  }, [productList]);

  const goBack = () => {
    if (source === "shoppingCart") {
      navigate("/shopping_cart", {
        state: { formItems: formItems, showCart: true },
      });
    } else {
      navigate("/buy_soap", { state: { formItems: formItems } });
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-center ">
        <Row className="pt-4 pb-2 mt-3 rowStyleDark">
          <Col md={8}>
            <h5 className="centered">비누 주문서</h5>
          </Col>
        </Row>
      </div>
      <div className="d-flex justify-content-center">
        <CheckoutCart
          productList={productList}
          grandTotal={grandTotal.toLocaleString()}
        />
      </div>
      <div className="d-flex justify-content-center ">
        <Row className="pt-4 pb-2 rowStyleDark">
          <Col md={8}>
            <h5 className="centered">수신처</h5>
          </Col>
        </Row>
      </div>
      <Form onSubmit={gotoPayment}>
        <div className="d-flex justify-content-center ">
          <Row className="justify-content-center pb-5 rowStyle">
            <Col md={9}>
              <div className="table-container">
                <RecepientInfo formData={formData} setFormData={setFormData} />
              </div>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-center ">
          <Row className="justify-content-center rowStyle">
            <Col md={4} style={{ minWidth: "350px" }}>
              {alertSuccess && (
                <AlertMessage type={"success"} message={successMsg} />
              )}
              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-center ">
          <Row
            className="justify-content-center pb-5 rowStyle"
            style={{ display: "flex", gap: "20px" }}
          >
            <Button
              variant="info"
              className="pt-2 pb-2 order-button-width"
              onClick={goBack}
            >
              <span className="boldText">뒤로</span>
            </Button>
            <Button
              type="submit"
              variant="success"
              className="pt-2 pb-2 order-button-width"
            >
              <span className="boldText">결제</span>
            </Button>
          </Row>
        </div>
      </Form>
    </div>
  );
};

export default Recepient;
