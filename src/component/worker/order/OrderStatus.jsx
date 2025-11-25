import React, { useState } from "react";
import { Form } from "react-bootstrap";
import ConfirmationModal from "../../modal/ConfirmationModal";

const OrderStatus = ({ statusLabels, value, soapOrders, orderIndex }) => {
  const [statusValue, setStatusValue] = useState(value);

  // 예정 주문 상태
  const [toState, setToState] = useState("");

  const handleStatusChange = (event) => {
    setToState(event.target.value);

    // 주문 상태 변경 의지 확인
    setShowModal(true);
  };

  const isDisabled = (value, label) => {
    let result = true;

    switch (value) {
      case "결제완료":
        result = label === "발주확인" ? false : true;
        break;

      case "발주확인":
        result = label === "GS25 접수" ? false : true;
        break;

      default:
        break;
    }
    return result;
  };

  const [showModal, setShowModal] = useState(false);

  const getMessage = () => {
    return "'" + soapOrders[orderIndex].orderName + "' 주문을 발주하겠습니까?";
  };

  const handleConfirm = () => {
    setShowModal(false);

    const status = soapOrders[orderIndex]["orderStatus"];

    if (status === "결제완료") {
      setStatusValue(toState);
      soapOrders[orderIndex]["orderStatus"] = toState;
      console.log("후단 상태 변경요청 대상 주문ID: ", soapOrders[orderIndex].id);      
    }
  };

  return (
    <React.Fragment>
  <ConfirmationModal
    show={showModal}
    handleClose={() => setShowModal(false)}
    handleConfirm={handleConfirm}
    getMessage={getMessage}
    title="주문 상태 변경 확인"
  />
      <Form.Group>
        <Form.Control
          as="select"
          name="orderStatus"
          value={statusValue}
          onChange={handleStatusChange}
          className="form-select"
        >
          {statusLabels.map((statusLabel, index) => (
            <option
              value={statusLabel}
              key={index}
              disabled={isDisabled(statusValue, statusLabel)}
            >
              {statusLabel}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
    </React.Fragment>
  );
};

export default OrderStatus;
