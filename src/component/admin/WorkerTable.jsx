import React, { useEffect, useState } from 'react'
import { getWorkerList } from '../worker/WorkerService';
import { Link, useNavigate } from 'react-router-dom';
import BsAlertHook from '../hook/BsAlertHook';
import { BsEyeFill, BsLockFill, BsPencilFill, BsPlusSquareFill, BsTrashFill, BsUnlockFill } from 'react-icons/bs';
import AlertMessage from '../common/AlertMessage';
import { Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { deleteUserAccount, toggleEnabledColumn } from "../user/UserService";
import DeleteConfirmModal from '../modal/DeleteConfirmModal';

const WorkerTable = () => {
  const [workerList, setWorkerList] = useState([]);
  const [showDelModal, setShowDelModal] = useState(false);
  const [delTargetId, setDelTargetId] = useState(null);
  const [delTargetName, setDelTargetName] = useState(null);

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

  const handleLockToggle = async (worker) => {
    try {
      let result = await toggleEnabledColumn(worker.id);
      setWorkerList(
        workerList.map((worker) =>
          worker.id === worker.id
            ? { ...worker, enabled: !worker.enabled }
            : worker
        )
      );
      setAlertError(false);
      setSuccessMsg(result.message + ", 활성값: " + !worker.enabled);
      setAlertSuccess(true);
    } catch (e) {
      console.error("e:", e);
      setErrorMsg(e.response.data.message);
      setAlertSuccess(false);
      setAlertError(true);
    }
  };  

  const handleDeletion = async () => {
    if (delTargetId) {
      try {
        const result = await deleteUserAccount(delTargetId);
        setSuccessMsg(result.message);
        setAlertSuccess(true);
        setShowDelModal(false);
        readWorkerList();
      } catch (err) {
        console.error("err:", err);
        setErrorMsg(err.message);
        setAlertError(true);
      }
    }
  };

  useEffect(() => {
    readWorkerList();
  }, []);

  const processDeletion = async (id, name) => {
    setDelTargetId(id);
    setDelTargetName(name);
    setShowDelModal(true);
  }

  return (
    <main>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleDeletion}
        target={`${delTargetName}`}
      />
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
              <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${index}`}>삭제</Tooltip>
                  }
                >
                  <Link
                    to={"#"}
                    className="text-danger"
                    onClick={() => processDeletion(worker.id, worker.fullName)}
                  >
                    <BsTrashFill />
                  </Link>
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