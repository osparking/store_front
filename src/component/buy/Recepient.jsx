import { Col, Row } from "react-bootstrap";
import { Form, useLocation } from "react-router-dom";
import BsAlertHook from "../hook/BsAlertHook";
import CheckoutCart from "./CheckoutCart";
import "./recepient.css";
import { useState } from "react";

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

  return (
    <div>
      <div className="d-flex justify-content-center">
        <CheckoutCart productList={productList} grandTotal={grandTotal}/>
      </div>
    </div>
  );
};

export default Recepient;