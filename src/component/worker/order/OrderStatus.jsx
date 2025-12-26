import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { changeOrderStatus, storeWaybillNo } from "../../buy/orderService";
import ConfirmationModal from "../../modal/ConfirmationModal";
import WaybillModal from "../../modal/WaybillModal";

const OrderStatus = ({ statusLabels, order, loadOrderPage }) => {
  // 예정 주문 상태
  const [toState, setToState] = useState("");

  const handleStatusChange = (event) => {
    setToState(event.target.value);

    // 주문 상태 변경 의지 확인
    if (order.orderStatus === "결제완료") {
      setShowModal(true);
    } else {
      setShowWaybillModal(true);
    }
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
  const [showWaybillModal, setShowWaybillModal] = useState(false);

  const getWaybillMessage = () => {
    return "'" + order.customer + "'님의 " + order.orderName + " 주문 상품";
  };

  const handleWaybillConfirm = async (waybillNo) => {
    try {
      setShowWaybillModal(false);
      const data = {
        id: order.id,
        status: toState,
        waybillNo: waybillNo,
      };

      const result = await storeWaybillNo(data);
      loadOrderPage();
      console.log("운송장번호 저장 결과: ", JSON.stringify(result));
    } catch (error) {
      console.error("운송장번호 저장 에러:", error);
    }
  };

  const handleConfirm = async () => {
    setShowModal(false);
    if (order.orderStatus === "결제완료") {
      const data = { id: order.id, status: toState };
      const result = await changeOrderStatus(data);
      loadOrderPage();
      console.log("주문 상태 갱신: ", JSON.stringify(result));
    }
  };

  return (
    <React.Fragment>
      <ConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={handleConfirm}
        bodyMessage={`'${order.customer}' 님 주문을 발주하겠습니까?`}
        title="범이비누 주문 발주"
        noLabel="발주 보류"
        yesLabel="발주 진행"
      />
      <WaybillModal
        show={showWaybillModal}
        handleClose={() => setShowWaybillModal(false)}
        handleSubmit={handleWaybillConfirm}
        getMessage={getWaybillMessage}
        title="운송장번호 등록"
      />
      <Form.Group>
        <Form.Control
          as="select"
          name="orderStatus"
          value={order.orderStatus}
          onChange={handleStatusChange}
          className="form-select"
        >
          {statusLabels.map((statusLabel, index) => (
            <option
              value={statusLabel}
              key={index}
              disabled={isDisabled(order.orderStatus, statusLabel)}
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
