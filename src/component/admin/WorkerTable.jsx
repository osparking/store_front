import React, { useEffect, useState } from 'react'
import { getWorkerList } from '../worker/WorkerService';
import { Link, useNavigate } from 'react-router-dom';
import BsAlertHook from '../hook/BsAlertHook';
import { BsEyeFill, BsLockFill, BsPencilFill, BsPlusSquareFill, BsUnlockFill } from 'react-icons/bs';
import AlertMessage from '../common/AlertMessage';
import { Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';

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

  const handleLockToggle = async (vet) => {
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
        <Col>
           {" "}
           <div className="d-flex justify-content-end">
             <Link to={"/register-user"}>
               {" "}
               <BsPlusSquareFill />
             </Link>
           </div>
         </Col>
      </Row>
      <Table bordered hover striped>
        <thead>
          <tr>
            <th>성명</th>
            <th>이메일</th>
            <th>휴대폰</th>
            <th>소속</th>
            <th>계정상태</th>
            <th>등록일</th>
            <th>사진</th>
            <th colSpan={4}>작업</th>
          </tr>
        </thead>
        <tbody>
          {workerList.map((worker, index) => (
            <tr key={index}>
              <td>{worker.fullName}</td>
              <td>{worker.email}</td>
              <td>{worker.mbPhone}</td>
              <td>{worker.dept}</td>
              <td>{worker.enabled ? "활성" : "비활성"}</td>
              <td>{worker.addDate}</td>
              <td>{worker.photoId ? "유" : "무"}</td>
              <td>
               <OverlayTrigger
                 overlay={
                   <Tooltip id={`tooltip-view-${index}`}>상세 보기</Tooltip>
                 }
               >
                 <Link to={`/dashboard/${worker.id}/user`} className="text-info">
                   <BsEyeFill />
                 </Link>
               </OverlayTrigger>
             </td>
             <td>
               <OverlayTrigger
                 overlay={
                   <Tooltip id={`tooltip-view-${index}`}>정보 편집</Tooltip>
                 }
               >
                 <Link to={`/user/${worker.id}/update`} className="text-warning">
                   <BsPencilFill />
                 </Link>
               </OverlayTrigger>
             </td>
             <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${index}`}>
                      {worker.enabled ? "계정 잠금" : "잠금 해제"}
                    </Tooltip>
                  }
                >
                  <span
                    onClick={() => handleLockToggle(worker)}
                    style={{ cursor: "pointer" }}
                  >
                    {worker.enabled ? <BsUnlockFill /> : <BsLockFill />}
                  </span>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>      
    </main>
  )
}

export default WorkerTable