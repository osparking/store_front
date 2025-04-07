import React, { useEffect, useState } from 'react'
import { getCustomerList } from '../customer/CustomerService';
import BsAlertHook from '../hook/BsAlertHook';
import { Col, Form, InputGroup, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { BsEyeFill } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import AlertMessage from '../common/AlertMessage';
import ItemFilter from '../common/ItemFilter';

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

  const emails = Array.from(new Set(customers.map(
    (customer) => customer.email))).sort();
  const [selectedEmail, setSelectedEmail] = useState(
    localStorage.getItem("selectedEmail") || ""
  );
  const [emailSubstr, setEmailSubstr] = useState(
    localStorage.getItem("emailSubstr") || ""
  );
  const clearFilter = () => {
    setSelectedEmail("");
  };

  const [filteredOnes, setFilteredOnes] = useState([]);
  useEffect(() => {
    if (selectedEmail) {
      setFilteredOnes(customers.filter((customer) => customer.email === selectedEmail))
    } else if (emailSubstr) {
      setFilteredOnes(customers.filter(
        (customer) => customer.email.includes(emailSubstr)));
    } else {
      setFilteredOnes(customers);
    }
  }, [customers, selectedEmail, emailSubstr]);

  const handleEmailSelect = (value) => {
    console.log("value", value);
    if (value) {
      setEmailSubstr("");
    }
    setSelectedEmail(value);
    localStorage.setItem("selectedEmail", value);
  }

  const handleEmailSubChg = (e) => {
    clearFilter();
    setEmailSubstr(e.target.value);
    localStorage.setItem("emailSubstr", e.target.value);
  };

  useEffect(() => {
    readCustomerList();
  }, []);

  return (
    <main>
      <Row>
        <Col></Col>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && (
            <AlertMessage type={"danger"} message={errorMsg} />
          )}
        </Col>
      </Row>
      <Row className="mb-2">
        <Col md={6}>
          <ItemFilter
            itemType={"이메일"}
            options={emails}
            onClearFilter={clearFilter}
            onOptionSelection={handleEmailSelect}
            selectedOption={selectedEmail}
          />
        </Col>
        <Col md={3}>
          <InputGroup>
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
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>아이디</th>
            <th>성명</th>
            <th>휴대폰</th>
            <th>이메일</th>
            <th>인증</th>
            <th>등록일시</th>
            <th>유저유형</th>
            <th colSpan={2}>작업</th>
          </tr>
        </thead>
        <tbody>
          {filteredOnes.map((customer, idx) => (
            <tr key={idx}>
              <td>{customer.id}</td>
              <td>{customer.fullName}</td>
              <td>{customer.mbPhone}</td>
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
                  <Link
                    to={`/dashboard/${customer.id}/user`}
                    className="text-info"
                    state={{ userState: customer }}>
                    <BsEyeFill />
                  </Link>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}

export default CustomerTable