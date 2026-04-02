import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ItemFilter from "../common/ItemFilter";
import Paginator from "../common/Paginator";
import BsAlertHook from "../hook/BsAlertHook";
import DeleteConfirmModal from "../modal/DeleteConfirmModal";
import { deleteUserAccount } from "../user/UserService";
import { callWithToken } from "../util/api";
import { getRecordRange } from "../util/utilities";
import "./AdminCanvas.css";
import WorkersTable from "./WorkersTable";
import "./WorkersTable.css";

const ManageWorkers = () => {
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
      const response = await callWithToken("get", "/admin/worker/get_all");
      if (response) {
        setWorkerList(response.data.data);
      } else {
        navigate("/login");
      }
    } catch (err) {
      setErrorMsg(err.message);
      setAlertError(true);
    }
  };

  const handleLockToggle = async (worker) => {
    try {
      const result = await callWithToken(
        "put",
        `/admin/worker/${worker.id}/toggle`,
      );
      console.log("result:" + JSON.stringify(result));
      setReloadFlag(!reloadFlag);
      setAlertError(false);
      setSuccessMsg(result.data.message + ", 활성값: " + !worker.enabled);
      setAlertSuccess(true);
    } catch (e) {
      console.error("e:", e);
      setErrorMsg(e.response.data.message);
      setAlertSuccess(false);
      setAlertError(true);
    }
  };

  const [delBtnDisabled, setDelBtnDisabled] = useState(false);
  const handleDeletion = async () => {
    if (delTarget) {
      try {
        setDelBtnDisabled(true);
        const result = await deleteUserAccount(delTarget.id);
        setSuccessMsg(result.message);
        setAlertSuccess(true);
        setShowDelModal(false);
        readWorkerList();
      } catch (err) {
        console.error("err:", err);
        setErrorMsg(err.message);
        setAlertError(true);
      } finally {
        setDelBtnDisabled(false);
      }
    }
  };

  useEffect(() => {
    readWorkerList();
  }, [reloadFlag]);

  const processDeletion = async (id, name) => {
    setDelTarget({ id, name });
    setShowDelModal(true);
  };

  const [pageSize] = useState(10);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [selectedDept, setSelectedDept] = useState(
    localStorage.getItem("SELECTED_DEPT") | "",
  );
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const savedDept = localStorage.getItem("SELECTED_DEPT");
    let searchKey = undefined;

    /**
     * selectedDept 는 재방문 때 0 이되고,
     * 초기화 혹은 목록 중 '-소속 선택-' 클릭 때 ""(빈문자열)이 된다.
     * 재방문 후에는 저장된 부서 검색 기준인 savedDept 가 우선이다.
     */
    // 일꾼 필터링 기준 부서명칭 식별하여 searchKey 에 저장.
    if (selectedDept === 0 && savedDept) {
      setSelectedDept(savedDept);
      searchKey = savedDept;
    } else if (selectedDept !== 0 && selectedDept !== "") {
      searchKey = selectedDept;
    }
    // 검색키에 의미있는 값이 들어있으면, 이로써 일꾼을 걸러낸다.
    if (searchKey) {
      setFilteredWorkers(
        workerList.filter((worker) => worker.dept === searchKey),
      );
    } else {
      setFilteredWorkers(workerList);
    }
    console.log(
      "Math.ceil(workerList.length / pageSize): ",
      Math.ceil(workerList.length / pageSize),
    );

    setTotalPages(Math.ceil(filteredWorkers.length / pageSize));

    // 유저가 의도적으로 택한 검색키를 저장소에 보관한다.
    if (selectedDept && selectedDept !== 0) {
      localStorage.setItem("SELECTED_DEPT", selectedDept);
    }
  }, [workerList, selectedDept]);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredWorkers.length / pageSize));
  }, [filteredWorkers, pageSize]);

  const departments = Array.from(
    new Set(workerList.map((worker) => worker.dept)),
  );

  const handleClearFilter = () => {
    localStorage.removeItem("SELECTED_DEPT");
    localStorage.removeItem("CURR_WORKER_PAGE");
    setSelectedDept("");
  };

  const handleDeptSelection = (e) => {
    setSelectedDept(e);
    localStorage.removeItem("CURR_WORKER_PAGE");
    setCurrWorkerPage(1);
  };

  const [currWorkerPage, setCurrWorkerPage] = useState(
    Number(localStorage.getItem("CURR_WORKER_PAGE")) || 1,
  );

  const idxLastPlus1 = currWorkerPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;
  const displayWorkers = filteredWorkers.slice(indexOfFirst, idxLastPlus1);

  const setAndSavePageNo = (pageNo) => {
    setCurrWorkerPage(pageNo);
    localStorage.setItem("CURR_WORKER_PAGE", pageNo);
  };

  return (
    <>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleDeletion}
        target={`${delTarget.name} 계정의`}
        disabled={delBtnDisabled}
      />
      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        </Col>
      </Row>
      <Row className="justify-content-between">
        <Col md={1}>
          <div></div>
        </Col>
        <Col md={6} xs={10} style={{ maxWidth: "350px" }}>
          <ItemFilter
            itemType={"소속"}
            options={departments}
            onClearFilter={handleClearFilter}
            onOptionSelection={handleDeptSelection}
            selectedOption={selectedDept}
          />
        </Col>
        <Col md={1} xs={1}>
          <div className="d-flex justify-content-end worker-add-link">
            <Link to={"/register_user"}>
              <BsPlusSquareFill />
            </Link>
          </div>
        </Col>
      </Row>
      <p className="text-center mb-1">
        {getRecordRange(
          { totalElements: filteredWorkers.length },
          indexOfFirst,
          idxLastPlus1,
          "직원",
        )}
      </p>
      <Card
        id="worker-table-card"
        className="p-0"
        style={{ overflowY: "auto" }}
      >
        <Card.Body className="p-0">
          <div
            id="worker-table-div"
            style={{
              whiteSpace: "initial",
              margin: "20px",
            }}
            className="justify-content-center align-items-center"
          >
            {WorkersTable(displayWorkers)}
          </div>
        </Card.Body>
      </Card>

      <Paginator
        pageSize={pageSize}
        totalItems={filteredWorkers.length}
        totalPages={totalPages}
        currPage={currWorkerPage}
        setCurrPage={setAndSavePageNo}
        darkBackground={true}
      />
    </>
  );
};

export default ManageWorkers;
