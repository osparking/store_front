import React, { useEffect, useState } from 'react'
import { getCustomerList } from '../customer/CustomerService';
import BsAlertHook from '../hook/BsAlertHook';

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
    <div>Customer Table</div>
  )
}

export default CustomerTable