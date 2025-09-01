import { Col, Row } from "react-bootstrap";
import { Form, useLocation } from "react-router-dom";
import BsAlertHook from "../hook/BsAlertHook";
import CheckoutCart from "./CheckoutCart";
import "./recepient.css";
import { useState } from "react";
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
  const { productList } = location.state || [];

  const findRoadAddr = (e) => {
    e.preventDefault();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const calcGrandTotal = (productList) => {
    const grand = productList
      .map((prod) => prod.subTotal)
      .reduce((sum, num) => sum + num, 0);
    return grand.toLocaleString();
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
      zBunAddress:
        "경기도 하남시 망월동 1050 (미사강변센텀팰리스(CentumPalace))",
    },
    mbPhone: "",
    fullName: "홍길동",
  });

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
        <CheckoutCart productList={productList} grandTotal={grandTotal} />
      </div>
      <div className="d-flex justify-content-center ">
        <Row className="pt-4 pb-2 rowStyleDark">
          <Col md={8}>
            <h5 className="centered">수신처</h5>
          </Col>
        </Row>
      </div>
      <div className="d-flex justify-content-center ">
        <Row className="justify-content-center pb-5 rowStyle">
          <Col md={9}>
            <Form onSubmit={handleSubmit}>
              <div className="table-container">
                <RecepientInfo formData={formData} setFormData={setFormData} />
              </div>
            </Form>
          </Col>
        </Row>
      </div>      
    </div>
  );
};

export default Recepient;
