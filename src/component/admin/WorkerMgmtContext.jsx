import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import ItemFilter from "../common/ItemFilter";
import Paginator from "../common/Paginator";
import BsAlertHook from "../hook/BsAlertHook";
import UserProfile from "../user/UserProfile";
import { getRecordRange } from "../util/utilities";
import {
  deleteWorkerSoftly,
  getAllDept,
  getWorkerPage,
} from "../worker/WorkerService";
import "./AdminCanvas.css";
import WorkersTable from "./WorkersTable";
import "./WorkersTable.css";

const WorkerMgmtContext = createContext();

export const WorkerMgmtProvider = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [workerPage, setWorkerPage] = useState({});
  const [workers, setWorkers] = useState([]);
  const [fetchResult, setFetchResult] = useState();
  const [pageSize, setPageSize] = useState(10); // itemsPerPage

  const [currWorkerPage, setCurrWorkerPage] = useState(
    Number(localStorage.getItem("CURR_WORKER_PAGE")) || 1,
  );

  const idxLastPlus1 = currWorkerPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

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

  const [selectedDept, setSelectedDept] = useState(
    localStorage.getItem("SELECTED_DEPT") || "",
  );

  const [loading, setLoading] = useState(false);

  const fetchWorkerPage = async (pageNo) => {
    try {
      const page =
        pageNo !== undefined
          ? pageNo
          : localStorage.getItem("CURR_WORKER_PAGE") || 1;

      setLoading(true);
      const response = await getWorkerPage(selectedDept, page, pageSize);
      setLoading(false);
      setFetchResult(response);

      if (response && response.pageContent) {
        setTotalPages(response.totalPages);
        setWorkerPage(response.pageContent);
        setWorkers(response.pageContent.content);
        setPageSize(response.pageSize);
        setCurrWorkerPage(response.currentPage);
      }
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setAlertError(true);
    }
  };

  const readDepts = async () => {
    try {
      const response = await getAllDept();
      setDepartments(response.data);
    } catch (error) {
      console.error(error.response?.data.message);
    }
  };

  useEffect(() => {
    fetchWorkerPage(currWorkerPage);
  }, [currWorkerPage]);

  useEffect(() => {
    if (selectedDept) {
      localStorage.setItem("SELECTED_DEPT", selectedDept);
    } else {
      localStorage.removeItem("SELECTED_DEPT");
    }
    fetchWorkerPage(currWorkerPage);
  }, [selectedDept]);

  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    readDepts();
  }, []);

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

  const setAndSavePageNo = (pageNo) => {
    setCurrWorkerPage(pageNo);
    localStorage.setItem("CURR_WORKER_PAGE", pageNo);
  };

  const [showDetails, setShowDetails] = useState(false);
  const [account, setAccount] = useState({});

  const showAccountDetails = (account) => {
    setAccount(account);
    setShowDetails(true);
  };

  const handleDeletion = async (workerId) => {
    try {
      const result = await deleteWorkerSoftly(workerId);
      setSuccessMsg(result.message);
      setAlertSuccess(true);
      fetchWorkerPage(currWorkerPage);
      setAccount({ ...account, worker: { ...account.worker, deleted: true } });
    } catch (err) {
      console.error("err:", err);
      setErrorMsg(err.message);
      setAlertError(true);
    }
  };

  const manageFunctions = {
    fetchWorkerPage,
    readDepts,
  };

  return (
    <WorkerMgmtContext.Provider value={manageFunctions}>
      {showDetails ? (
        <UserProfile
          user={account.worker}
          setShowDetails={setShowDetails}
          readOnly={!account.editable}
          handleDeletion={handleDeletion}
        />
      ) : (
        <>
          <Row className="justify-content-center">
            <Col>
              {alertSuccess && (
                <AlertMessage type={"success"} message={successMsg} />
              )}
              {alertError && (
                <AlertMessage type={"danger"} message={errorMsg} />
              )}
            </Col>
          </Row>
          <Row className="justify-content-between mb-2">
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
            {getRecordRange(workerPage, indexOfFirst, idxLastPlus1, "직원")}
          </p>
          <Card
            id="user-table-card"
            className="p-0"
            style={{ overflowY: "auto" }}
          >
            <Card.Body className="p-0">
              <div
                style={{
                  whiteSpace: "initial",
                  margin: "20px",
                }}
                className="justify-content-center align-items-center"
              >
                {loading ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                      style={{ width: "0.8rem", height: "0.8rem" }}
                    />
                    로딩 중...
                  </div>
                ) : (
                  <WorkersTable
                    displayWorkers={workers}
                    showAccountDetails={showAccountDetails}
                    handleDeletion={handleDeletion}
                    currWorkerPage={currWorkerPage}
                  />
                )}
              </div>
            </Card.Body>
          </Card>
          {fetchResult && workerPage && (
            <Paginator
              pageSize={workerPage.pageSize}
              totalItems={workerPage.totalElements}
              totalPages={totalPages}
              currPage={currWorkerPage}
              setCurrPage={(page) => setAndSavePageNo(page)}
              darkBackground={true}
            />
          )}
        </>
      )}
    </WorkerMgmtContext.Provider>
  );
};

export function useWorkerMgmt() {
  const context = useContext(WorkerMgmtContext);
  if (!context) {
    throw new Error("useWorkerMgmt은 WorkerMgmtProvider 안에서 사용할 것.");
  }
  return context;
}
