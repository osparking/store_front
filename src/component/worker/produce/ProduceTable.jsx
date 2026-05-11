import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "../WorkerCanvas.css";
import "../WorkerTable.css";

const ProduceTable = (produceRows, currentPage) => {
  const produceTable7columns = () => {
    return (
      <>
        <col style={{ width: "07%" }} />
        <col style={{ width: "12%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "17%" }} />
      </>
    );
  };

  const produceTableHeaderColumns = () => {
    return (
      <colgroup>
        {produceTable7columns()}
        <col style={{ width: "16%" }} />
      </colgroup>
    );
  };

  const produceTableBodyColumns = () => {
    return (
      <colgroup>
        {produceTable7columns()}
        <col style={{ width: "8%" }} />
        <col style={{ width: "8%" }} />
      </colgroup>
    );
  };

  return (
    <div className="worker-table-wrapper">
      <div className="table-header">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: "730px",
          }}
        >
          {produceTableHeaderColumns()}
          <thead>
            <tr>
              <th>순번</th>
              <th>외형</th>
              <th>수량(개)</th>
              <th>생산일</th>
              <th>생산자 (ID)</th>
              <th>등록자 (ID)</th>
              <th>등록일시</th>
              <th colSpan={2}>작업</th>
            </tr>
          </thead>
        </table>
      </div>
      <div className="table-body produce">
        <table
          className="table table-bordered table-hover table-striped"
          style={{
            tableLayout: "fixed",
            minWidth: "730px",
          }}
        >
          {produceTableBodyColumns()}
          <tbody>
            {produceRows.map((produce, index) => (
              <tr key={index}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{produce.shape}</td>
                <td>{produce.quantity}</td>
                <td>{produce.produceDate}</td>
                <td>
                  {produce.producerName} ({produce.producerId})
                </td>
                <td>
                  {produce.registerName} ({produce.registerId})
                </td>
                <td>{produce.registerTime}</td>
                <td style={{ width: "50px" }}>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>정보 편집</Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      style={{ backgroundColor: "transparent", border: "none" }}
                      onClick={() => editProduceInfo(produce)}
                    >
                      <BsPencilFill className="text-success" />
                    </Button>
                  </OverlayTrigger>
                </td>
                <td style={{ width: "50px" }}>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>
                        입고 기록 삭제
                      </Tooltip>
                    }
                  >
                    <Link
                      to={"#"}
                      className="text-danger"
                      onClick={() => handleShowDelModal(produce)}
                    >
                      <BsTrashFill />
                    </Link>
                  </OverlayTrigger>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProduceTable;
