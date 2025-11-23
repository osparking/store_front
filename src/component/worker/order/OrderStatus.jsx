import React, { useState } from "react";
import { Form } from "react-bootstrap";

const OrderStatus = ({ statusLabels, value, onChange }) => {
  const [statusValue, setStatusValue] = useState(value);

  // 상태 변화 처리
  const handleStatusChange = (event) => {
    // 모달을 통하여 주문 상태 변경 의지 재 확인
    onChange(event);
    setStatusValue(event.target.value);
  };

  const isDisabled = (value, label) => {
    let result = true;
    
    switch(value) {
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
  }

  return (
    <React.Fragment>
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
