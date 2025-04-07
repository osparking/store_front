import React, { useEffect, useState } from 'react'
import { getWorkerList } from '../worker/WorkerService';
import { Link, useNavigate } from 'react-router-dom';
import BsAlertHook from '../hook/BsAlertHook';
import { BsEyeFill, BsLockFill, BsPencilFill, BsPlusSquareFill, BsTrashFill, BsUnlockFill } from 'react-icons/bs';
import AlertMessage from '../common/AlertMessage';
import { Col, OverlayTrigger, Row, Table, Tooltip } from 'react-bootstrap';
import { deleteUserAccount, toggleEnabledColumn } from "../user/UserService";
import DeleteConfirmModal from '../modal/DeleteConfirmModal';
import ItemFilter from '../common/ItemFilter';
import Paginator from '../common/Paginator';

const WorkerTable = () => {
  const [workerList, setWorkerList] = useState([]);
  const [showDelModal, setShowDelModal] = useState(false);
  const [delTarget, setDelTarget] = useState({});
  const [reloadFlag, setReloadFlag] = useState(false);

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
      setReloadFlag(!reloadFlag);
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
    if (delTarget) {
      try {
        const result = await deleteUserAccount(delTarget.id);
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
  }, [reloadFlag]);

  const processDeletion = async (id, name) => {
    setDelTarget({ id, name });
    setShowDelModal(true);
  }

  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedDept, setSelectedDept] = useState(
    localStorage.getItem("selectedDept") | "");

  useEffect(() => {
    const savedDept = localStorage.getItem("selectedDept");
    let searchKey = undefined;

    /**
     * selectedDept 는 재방문 때 0 이되고, 
     * 초기화 혹은 목록 중 '-소속 선택-' 클릭 때 ""(빈문자열)이 된다.
     * 재방문 후에는 저장된 부서 검색 기준인 savedDept 가 우선이다.
     */
    // 일꾼 필터링 기준 부서명칭 식별하여 searchKey 에 저장.
    if (selectedDept === 0 && savedDept !== "") {
      setSelectedDept(savedDept);
      searchKey = savedDept;
    } else if (selectedDept !== 0 && selectedDept !== "") {
      searchKey = selectedDept;
    }
    // 검색키에 의미있는 값이 들어있으면, 이로써 일꾼을 걸러낸다.
    if (searchKey) {
      setFilteredWorkers(workerList.filter(
        (worker) => worker.dept === searchKey));
    } else {
      setFilteredWorkers(workerList);
    }
    // 유저가 의도적으로 택한 검색키를 저장소에 보관한다. 
    if (selectedDept !== 0) {
      localStorage.setItem("selectedDept", selectedDept);
    }
  }, [workerList, selectedDept])

  const departments = Array.from(
    new Set(workerList.map((worker) => worker.dept))
  );

  const handleClearFilter = () => {
    localStorage.setItem("selectedDept", "");
    setSelectedDept("");
  }

  const [currPage, setCurrPage] = useState(1);
  const [pageSize] = useState(10);
  const idxLastPlus1 = currPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;
  const displayWorkers = filteredWorkers.slice(indexOfFirst, idxLastPlus1);

  return (
    <main>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleDeletion}
        target={`${delTarget.name}`}
      />
      <h5 className='mb-3'>직원 관리</h5>
      <Row>
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
            itemType={"소속"}
            options={departments}
            onClearFilter={handleClearFilter}
            onOptionSelection={setSelectedDept}
            selectedOption={selectedDept}
          />
        </Col>
        <Col>
          {" "}
          <div className="d-flex justify-content-end">
            <Link to={"/register_user"}>
              {" "}
              <BsPlusSquareFill style={{ color: "lime" }} />
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
          {displayWorkers.map((worker, index) => (
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
                  <Link to={`/dashboard/${worker.id}/user`} 
                    className="text-info"
                    state={{ userState: worker }}>
                    <BsEyeFill />
                  </Link>
                </OverlayTrigger>
              </td>
              <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${index}`}>정보 수정</Tooltip>
                  }
                >
                  <Link to={`/user/${worker.id}/update`}
                    className="text-warning"
                    state={{ worker: worker }}>
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
      <Paginator
        pageSize={pageSize}
        totalItems={filteredWorkers.length}
        currPage={currPage}
        setCurrPage={setCurrPage}
      />
    </main>
  )
}

export default WorkerTable