import { useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
  BsEyeFill,
  BsLockFill,
  BsPencilFill,
  BsTrashFill,
  BsUnlockFill,
} from "react-icons/bs";
import { Link } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import DeleteWorkerConfirmModal from "../modal/DeleteWorkerConfirmModal";
import { callWithToken } from "../util/api";
import { insert2Hyphens } from "../util/utilities";
import { deleteWorkerSoftly } from "../worker/WorkerService";
import "./AdminCanvas.css";
import "./WorkersTable.css";

const WorkersTable = ({
  displayWorkers,
  showAccountDetails,
  readWorkerList,
  currentPage,
}) => {
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

  const handleLockToggle = async (worker) => {
    try {
      const result = await callWithToken(
        "put",
        `/admin/worker/${worker.id}/toggle`,
      );
      readWorkerList();
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
  const [showDelModal, setShowDelModal] = useState(false);
  const [delTarget, setDelTarget] = useState({});

  const processDeletion = async (worker) => {
    if (worker.deleted) {
      return;
    }
    setDelTarget({ id: worker.id, name: worker.name });
    setShowDelModal(true);
  };

  const handleDeletion = async () => {
    if (delTarget) {
      try {
        setDelBtnDisabled(true);
        const result = await deleteWorkerSoftly(delTarget.id);
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

  return (
    <>
      <Table bordered hover striped className="admin-worker-table">
        <thead>
          <tr>
            <th>성명</th>
            <th>이메일</th>
            <th>휴대폰</th>
            <th>소속</th>
            <th>계정상태</th>
            <th className="minDateWidthLong">등록일시</th>
            <th>사진</th>
            <th colSpan={4}>작업</th>
          </tr>
        </thead>
        <tbody>
          {displayWorkers.map((worker, index) => (
            <tr key={index}>
              <td>{worker.fullName}</td>
              <td>{worker.email}</td>
              <td>{insert2Hyphens(worker.mbPhone)}</td>
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
                  <Button
                    className="readEye"
                    onClick={() =>
                      showAccountDetails({ worker: worker, editable: false })
                    }
                  >
                    <BsEyeFill />
                  </Button>
                </OverlayTrigger>
              </td>
              <td>
                <OverlayTrigger
                  overlay={
                    <Tooltip id={`tooltip-view-${index}`}>정보 수정</Tooltip>
                  }
                >
                  <Button
                    className="readEye"
                    onClick={() =>
                      showAccountDetails({ worker: worker, editable: true })
                    }
                  >
                    <BsPencilFill />
                  </Button>
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
                  overlay={<Tooltip id={`tooltip-view-${index}`}>삭제</Tooltip>}
                >
                  <Link
                    to={"#"}
                    className={worker.deleted ? "grey-out" : "text-danger"}
                    onClick={() => processDeletion(worker)}
                  >
                    <BsTrashFill />
                  </Link>
                </OverlayTrigger>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {alertSuccess && <AlertMessage type={"success"} message={successMsg} />}
        {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
      </div>

      <DeleteWorkerConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleDeletion}
        target={`${delTarget.name}`}
        disabled={delBtnDisabled}
        modalClass="delete-worker-confirm"
      />
    </>
  );
};

export default WorkersTable;
