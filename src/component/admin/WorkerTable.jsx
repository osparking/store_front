import React, { useEffect, useState } from 'react'
import { getWorkerList } from '../worker/WorkerService';
import { useNavigate } from 'react-router-dom';
import BsAlertHook from '../hook/BsAlertHook';

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
  const navigate = useNavigate();

  const readWorkerList = async () => {
    try {
      const data = await getWorkerList();
      
      if (data) {
        console.log("일꾼 목록: ", data.data);
        setWorkerList(data.data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setErrorMsg(err.message);
      setAlertError(true);
    };
  };

  useEffect(() => {
    readWorkerList();
  }, []);

  return (
    <main>
      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && (
            <AlertMessage type={"danger"} message={errorMsg} />
          )}
        </Col>
        <Col></Col>
      </Row>
    </main>
  )
}

export default WorkerTable