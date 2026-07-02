import { useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import AlertMessage from "../common/AlertMessage";
import Paginator from "../common/Paginator";
import { getCustomerPage } from "../customer/CustomerService";
import BsAlertHook from "../hook/BsAlertHook";
import { getRecordRange } from "../util/utilities";
import CustomersTable from "./CustomersTable";
import "./ManageCustomers.css";

const ManageCustomers = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [customerPage, setCustomerPage] = useState({});
  const [customers, setCustomers] = useState([]);
  const [fetchResult, setFetchResult] = useState();
  const [pageSize, setPageSize] = useState(10); // itemsPerPage

  const savedPageNo = localStorage.getItem("CURR_CUST_PAGE");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);
  const [loading, setLoading] = useState(false);

  const [currCustomerPage, setCurrCustomerPage] = useState(
    Number(localStorage.getItem("CURR_CUST_PAGE")) || 1,
  );

  const idxLastPlus1 = currCustomerPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

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

  const fetchCustomerPage = async (pageNo = 1) => {
    try {
      setLoading(true);
      const response = await getCustomerPage(pageNo, pageSize, emailSubstr);
      setLoading(false);
      setFetchResult(response);

      if (response && response.pageContent) {
        setTotalPages(response.totalPages);
        setCustomerPage(response.pageContent);
        setCustomers(response.pageContent.content);
        setPageSize(response.pageSize);
        setCurrentPage(response.currentPage);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setAlertError(true);
    }
  };

  const emails = [];
  const [selectedEmail, setSelectedEmail] = useState(
    localStorage.getItem("SELECTED_EMAIL") || "",
  );
  const [emailSubstr, setEmailSubstr] = useState(
    localStorage.getItem("EMAIL_SUBSTR") || "",
  );
  const [nameSubstr, setNameSubstr] = useState(
    localStorage.getItem("NAME_SUBSTR") || "",
  );
  const clearFilter = () => {
    setSelectedEmail("");
    localStorage.removeItem("SELECTED_EMAIL");
    localStorage.removeItem("CURR_CUST_PAGE");
  };

  const handleEmailSelect = (value) => {
    localStorage.removeItem("CURR_CUST_PAGE");
    setCurrCustomerPage(1);
    if (value) {
      setEmailSubstr("");
    }
    setSelectedEmail(value);
    localStorage.setItem("SELECTED_EMAIL", value);
  };

  const handleNameSubChg = (e) => {
    clearFilter();
    setCurrCustomerPage(1);
    setEmailSubstr(e.target.value);
    localStorage.setItem("EMAIL_SUBSTR", e.target.value);
  };

  const handleEmailSubChg = (e) => {
    clearFilter();
    setCurrCustomerPage(1);
    setEmailSubstr(e.target.value);
    localStorage.setItem("EMAIL_SUBSTR", e.target.value);
  };

  useEffect(() => {
    fetchCustomerPage(1);
  }, []);

  const setAndSavePageNo = (pageNo) => {
    setCurrCustomerPage(pageNo);
    localStorage.setItem("CURR_CUST_PAGE", pageNo);
    fetchCustomerPage(pageNo);
  };

  const searchCustomers = () => {
    setAndSavePageNo(1);
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
        <Col md={2} style={{ maxWidth: "200px" }}></Col>
        <Col md={3} style={{ maxWidth: "200px" }}>
          <InputGroup className="mb-2">
            <Form.Label htmlFor="namePart" className="me-2">
              성명:
            </Form.Label>
            <Form.Control
              type="text"
              value={nameSubstr}
              placeholder="(성명 일부)"
              id="namePart"
              name="namePart"
              onChange={handleNameSubChg}
            />
          </InputGroup>
        </Col>
        <Col md={3} style={{ maxWidth: "200px" }}>
          <InputGroup className="mb-2">
            <Form.Label htmlFor="emailPart" className="me-2">
              이메일:
            </Form.Label>
            <Form.Control
              type="text"
              value={emailSubstr}
              placeholder="(이메일 일부)"
              id="emailPart"
              name="emailPart"
              onChange={handleEmailSubChg}
            />
          </InputGroup>
        </Col>
        <Col md={2} style={{ maxWidth: "200px" }}>
          <Button variant="primary" onClick={searchCustomers}>
            검색
          </Button>
        </Col>
      </Row>
      <p className="text-center mb-1">
        {getRecordRange(customerPage, indexOfFirst, idxLastPlus1, "고객")}
      </p>

      <Card id="user-table-card" className="p-0" style={{ overflowY: "auto" }}>
        <Card.Body className="p-0">
          <div
            style={{
              whiteSpace: "initial",
              margin: "20px",
            }}
            className="justify-content-center align-items-center"
          >
            {CustomersTable(customers)}
          </div>
        </Card.Body>
      </Card>

      {fetchResult && customerPage && (
        <Paginator
          pageSize={customerPage.size}
          totalItems={customerPage.totalElements}
          totalPages={totalPages}
          currPage={currCustomerPage}
          setCurrPage={(pageNo) => setAndSavePageNo(pageNo)}
          darkBackground={true}
        />
      )}
    </>
  );
};

export default ManageCustomers;
