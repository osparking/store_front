import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Form, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import CheckoutCart from "./CheckoutCart";
import DeliveryFee from "./DeliveryFee";
import { getDeliveryFee } from "./orderService";
import PaymentFee from "./PaymentFee";
import "./recipient.css";
import RecipientInfo from "./RecipientInfo";

const Recipient = () => {
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
  const { formItems, source, recipientDto, recipient } = location.state || [];
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
  const recipientDefault =
    (recipientDto && {
      addressDetail: recipientDto.addressDetail,
      doroZbun: recipientDto.doroZbun,
      addrBasisAddReq: {
        zipcode: recipientDto.zipcode,
        roadAddress: recipientDto.roadAddress,
        zbunAddress: recipientDto.zbunAddress,
      },
      mbPhone: recipientDto.mbPhone,
      fullName: recipientDto.fullName,
    }) ||
    null;

  const recipientEmpty = {
    addressDetail: "",
    doroZbun: "도로",
    addrBasisAddReq: {
      zipcode: "",
      roadAddress: "",
      zbunAddress: "",
    },
    mbPhone: "",
    fullName: "",
  };

  const [formData, setFormData] = useState(
    recipient || recipientDefault || recipientEmpty
  );

  const [isDefaultRecipient, setIsDefaultRecipient] = useState(
    recipientDto !== null
  );
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const callGetDeliveryFee = async () => {
      const result = await getDeliveryFee({
        zipcode: formData.addrBasisAddReq.zipcode,
        grandTotal: grandTotal,
      });
      setDeliveryFee(result.data);
      console.log("delivery fee: ", result.data);
    };
    if (formData.addrBasisAddReq.zipcode) {
      callGetDeliveryFee();
    }
  }, [formData.addrBasisAddReq.zipcode]);

  const gotoCheckout = async (e) => {
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

    const feeData = {
      productTotal: grandTotal,
      deliveryFee: deliveryFee,
      amount: grandTotal + deliveryFee,
    };

    navigate("/checkout", {
      state: {
        orderData: orderData,
        feeData: feeData,
        formItems: formItems,
        source: source,
      },
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
        state: { formItems: formItems, recipient: formData, showCart: true },
      });
    } else {
      navigate("/buy_soap", {
        state: { formItems: formItems, recipient: formData },
      });
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
      <div className="d-flex justify-content-center">
        <DeliveryFee deliveryFee={deliveryFee} />
      </div>
      <div className="d-flex justify-content-center">
        <PaymentFee paymentFee={grandTotal + deliveryFee} />
      </div>
      <div className="d-flex justify-content-center ">
        <Row className="pt-4 pb-2 rowStyleDark">
          <Col md={8}>
            <h5 className="centered">수신처</h5>
          </Col>
        </Row>
      </div>
      <Form onSubmit={gotoCheckout}>
        <div className="d-flex justify-content-center ">
          <Row className="justify-content-center pb-5 rowStyle">
            <Col md={9}>
              <div className="table-container">
                <RecipientInfo
                  formData={formData}
                  setFormData={setFormData}
                  isDefaultRecipient={isDefaultRecipient}
                  setIsDefaultRecipient={setIsDefaultRecipient}
                />
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

export default Recipient;
