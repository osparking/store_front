import React from 'react'

const WorkerTable = () => {
  const [workerList, setWorkerList] = useState([]);
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

  return (
    <div>일꾼 테이블</div>
  )
}

export default WorkerTable