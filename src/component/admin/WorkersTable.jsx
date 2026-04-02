import { OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import {
    BsEyeFill,
    BsLockFill,
    BsPencilFill,
    BsTrashFill,
    BsUnlockFill
} from "react-icons/bs";
import { Link } from "react-router-dom";
import "./AdminCanvas.css";
import "./WorkersTable.css";

const WorkersTable = (displayWorkers) => {
  return (
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
                <Link
                  to={`/dashboard/${worker.id}/user`}
                  className="text-info"
                  state={{ userState: worker }}
                >
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
                <Link
                  to={`/user/${worker.id}/update`}
                  className="text-warning"
                  state={{ userState: worker }}
                >
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
                overlay={<Tooltip id={`tooltip-view-${index}`}>삭제</Tooltip>}
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
  );
};

export default WorkersTable;
