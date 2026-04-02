import { useEffect, useState } from "react";
import {
  Col,
  Form,
  InputGroup,
  Row
} from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import ItemFilter from "../common/ItemFilter";
import Paginator from "../common/Paginator";
import { getCustomerList } from "../customer/CustomerService";
import BsAlertHook from "../hook/BsAlertHook";
import { getRecordRange } from "../util/utilities";
import CustomersTable from "./CustomersTable";
import "./ManageCustomers.css";

const CustomerTable = () => {
  const [customers, setCustomers] = useState([]);
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

  const readCustomerList = async () => {
    try {
      const response = await getCustomerList();
      setCustomers(response.data);
      console.log("고객: ", response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setAlertError(true);
    }
  };

  const emails = Array.from(
    new Set(customers.map((customer) => customer.email)),
  ).sort();
  const [selectedEmail, setSelectedEmail] = useState(
    localStorage.getItem("SELECTED_EMAIL") || "",
  );
  const [emailSubstr, setEmailSubstr] = useState(
    localStorage.getItem("EMAIL_SUBSTR") || "",
  );
  const clearFilter = () => {
    setSelectedEmail("");
    localStorage.removeItem("SELECTED_EMAIL");
    localStorage.removeItem("CURR_CUST_PAGE");
  };

  const [filteredOnes, setFilteredOnes] = useState([]);
  useEffect(() => {
    if (selectedEmail) {
      setFilteredOnes(
        customers.filter((customer) => customer.email === selectedEmail),
      );
    } else if (emailSubstr) {
      setFilteredOnes(
        customers.filter((customer) => customer.email.includes(emailSubstr)),
      );
    } else {
      setFilteredOnes(customers);
    }
  }, [customers, selectedEmail, emailSubstr]);

  const handleEmailSelect = (value) => {
    localStorage.removeItem("CURR_CUST_PAGE");
    setCurrCustomerPage(1);
    if (value) {
      setEmailSubstr("");
    }
    setSelectedEmail(value);
    localStorage.setItem("SELECTED_EMAIL", value);
  };

  const handleEmailSubChg = (e) => {
    clearFilter();
    setCurrCustomerPage(1);
    setEmailSubstr(e.target.value);
    localStorage.setItem("EMAIL_SUBSTR", e.target.value);
  };

  useEffect(() => {
    readCustomerList();
  }, []);

  const [currCustomerPage, setCurrCustomerPage] = useState(
    localStorage.getItem("CURR_CUST_PAGE") || 1,
  );

  const [pageSize] = useState(10);
  const idxLastPlus1 = currCustomerPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;
  const displayCustomers = filteredOnes.slice(indexOfFirst, idxLastPlus1);

  const setAndSavePageNo = (pageNo) => {
    setCurrCustomerPage(pageNo);
    localStorage.setItem("CURR_CUST_PAGE", pageNo);
  };

  return (
    <>
      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        </Col>
      </Row>
      <Row
        className="mb-2"
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <Col md={6} style={{ maxWidth: "400px" }}>
          <ItemFilter
            itemType={"이메일"}
            options={emails}
            onClearFilter={clearFilter}
            onOptionSelection={handleEmailSelect}
            selectedOption={selectedEmail}
          />
        </Col>
        <Col md={3} style={{ maxWidth: "200px" }}>
          <InputGroup className="mb-2">
            <Form.Control
              type="text"
              value={emailSubstr}
              placeholder="(이메일 일부)"
              name="emailPart"
              onChange={handleEmailSubChg}
            />
          </InputGroup>
        </Col>
      </Row>
      <p className="text-center mb-1">
        {getRecordRange(
          { totalElements: filteredOnes.length },
          indexOfFirst,
          idxLastPlus1,
          "고객",
        )}
      </p>
      <div className="table-responsive admin-customer-table-container">
        {CustomersTable(displayCustomers)}
      </div>
      <Paginator
        pageSize={pageSize}
        totalItems={filteredOnes.length}
        totalPages={Math.ceil(filteredOnes.length / pageSize)}
        currPage={currCustomerPage}
        setCurrPage={setAndSavePageNo}
        darkBackground={true}
      />
    </>
  );
};

export default CustomerTable;
a;
