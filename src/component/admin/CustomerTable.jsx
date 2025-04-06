import React, { useEffect, useState } from 'react'
import { getCustomerList } from '../customer/CustomerService';
import BsAlertHook from '../hook/BsAlertHook';
import { Table } from 'react-bootstrap';

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

  useEffect(() => {
    readCustomerList();
  }, []);

  return (
    <main>
      <Table bordered hover striped>
        <thread>
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
        </thread>
        <tbody>
          {customers.map((customer, idx) => (
            <tr key={idx}>
              <td>{customer.id}</td>
              <td>{customer.fullName}</td>
              <td>{customer.mbPhone}</td>
              <td>{customer.email}</td>
              <td>{customer.enabled ? "예" : "아니오"}</td>
              <td>{customer.addDate}</td>
              <td>{customer.userType}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </main>
  );
}

export default CustomerTable