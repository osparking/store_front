import React, { useState } from "react";

const StoredIngre = () => {
  const [ingreList, setIngreList] = useState([]);
  const [showDelModal, setShowDelModal] = useState(false);
  const [workerToDel, setWorkerToDel] = useState(null);

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

  return <div>StoredIngre</div>;
};

export default StoredIngre;
