import { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import { BsEyeFill } from "react-icons/bs";
import CustomerInfoModal from "../modal/CustomerInfoModal";
import { insert2Hyphens } from "../util/utilities";
import "./CustomersTable.css";
import "./ManageCustomers.css";

const CustomersTable = (displayCustomers) => {
  const [showDetails, setShowDetails] = useState(false);
  const [customer, setCustomer] = useState({});
  const openDetailsModal = (customer) => {
    setCustomer(customer);
    setShowDetails(true);
  };

  return (
    <>
      <CustomerInfoModal
        show={showDetails}
        onHide={() => setShowDetails(false)}
        customer={customer}
      />
      <Table bordered hover striped className="admin-customer-table">
        <thead>
          <tr>
            <th>아이디</th>
            <th>성명</th>
            <th>휴대폰</th>
            <th>이메일</th>
            <th>인증</th>
            <th className="minDateWidthLong">등록일시</th>
            <th>유저유형</th>
            <th colSpan={2}>작업</th>
          </tr>
        </thead>
        <tbody>
          {displayCustomers.map((customer, idx) => (
            <tr key={idx}>
              <td>{customer.id}</td>
              <td>{customer.fullName}</td>
              <td style={{ minWidth: "100px" }}>
                {insert2Hyphens(customer.mbPhone)}
              </td>
              <td>{customer.email}</td>
              <td>{customer.enabled ? "예" : "아니오"}</td>
              <td>{customer.addDate}</td>
              <td>{customer.userType}</td>
              <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${idx}`}>상세 보기</Tooltip>
                  }
                >
                  <Button
                    className="readEye"
                    onClick={() => openDetailsModal(customer)}
                    style={{ padding: 0 }}
                  >
                    <BsEyeFill />
                  </Button>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default CustomersTable;
