import { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./OrderDigest.css";

const OrderDigest = ({ name, amount, address }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!name) return null;

  return (
    <div md={6} className="rounded">
      <div className="justify-content-center">
        <h5
          className="orderDigest"
          style={{
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            marginBottom: isOpen ? "1rem" : "0",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          주문 요약
          {isOpen ? <FaChevronDown /> : <FaChevronRight />}
        </h5>
      </div>

      {isOpen && (
        <ul className="mb-0">
          <li>주문 이름 : {name}</li>
          <li className="mt-0">결제 금액 : {amount.toLocaleString()} 원</li>
          <li className="mt-0">주소 : {address}</li>
        </ul>
      )}
    </div>
  );
};

export default OrderDigest;
