import { useEffect, useState } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { BsPencilFill, BsPlusSquareFill, BsTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import AlertMessage from "../../common/AlertMessage";
import Paginator from "../../common/Paginator";
import BsAlertHook from "../../hook/BsAlertHook";
import DeleteConfirmModal from "../../modal/DeleteConfirmModal";
import { getRecordRange } from "../../util/utilities";
import { deleteProduceRow } from "../WorkerService";
import ProduceInfoModal from "./ProduceInfoModal";
import { fetchProducePage } from "./ProduceService";
import "./RegisterProduce.css";

const RegisterProduce = () => {
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

  const savedPageNo = localStorage.getItem("PRODUCE_PAGE");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [producePage, setProducePage] = useState({});
  const [produceRows, setProduceRows] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 5;
  const [pageSize, setPageSize] = useState(itemsPerPage);

  const [producePerPage] = useState(itemsPerPage);
  const indexOfLastProduce = currentPage * producePerPage;
  const indexOfFirstProduce = indexOfLastProduce - producePerPage;
  const [loading, setLoading] = useState(false);

  const loadProducePage = async () => {
    setLoading(true);
    const response = await fetchProducePage(currentPage, pageSize);
    setLoading(false);

    if (response && response.pageContent) {
      setTotalPages(response.totalPages);
      setProducePage(response.pageContent);
      setProduceRows(response.pageContent.content);
      setPageSize(response.pageSize);
      setCurrentPage(response.currentPage);
    }
  };

  useEffect(() => {
    localStorage.setItem("PRODUCE_PAGE", currentPage);
    loadProducePage();
  }, [currentPage]);

  useEffect(() => {
    loadProducePage();
  }, []);

  const [showDelModal, setShowDelModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState(null);
  const [delBtnDisabled, setDelBtnDisabled] = useState(false);
  const [delRegTime, setDelRegTime] = useState("");

  const handleShowDelModal = (produce) => {
    setShowDelModal(true);
    setIdToDelete(produce.id);
    setDelRegTime(produce.registerTime.slice(-8));
  };

  const handleProduceDelete = async () => {
    if (idToDelete) {
      try {
        setDelBtnDisabled(true);
        const result = await deleteProduceRow(idToDelete);
        setSuccessMsg(result.message);
        setAlertSuccess(true);
        setShowDelModal(false);
        loadProducePage();
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
    const user = JSON.parse(localStorage.getItem("USER"));

    setDummyProduce({
      ...dummyProduce,
      producer: {
        id: user.id,
        name: user.fullName,
      },
    });
  }, []);

  const [dummyProduce, setDummyProduce] = useState({
    shapeLabel: "",
    quantity: 0,
    produceDate: new Date(),
    producer: {
      id: 0,
      name: "",
    },
  });

  const editProduceInfo = (produce) => {
    var produceInfo = {
      id: produce.id,
      shapeLabel: produce.shape,
      quantity: produce.quantity,
      produceDate: produce.produceDate,
      producer: {
        id: produce.producerId,
        name: produce.producerName,
      },
    };
    openProduceModal(produceInfo);
  };

  const [produceInfo, setProduceInfo] = useState(dummyProduce);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const openProduceModal = (produceInfo) => {
    setProduceInfo(produceInfo);
    setShowInfoModal(true);
  };

  return (
    <div>
      <DeleteConfirmModal
        show={showDelModal}
        onHide={() => setShowDelModal(false)}
        handleDeletion={handleProduceDelete}
        target={`${delRegTime} 시분초 입력 생산 정보`}
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
      <Row className="justify-content-center align-items-center">
        <Col xs={2}></Col>
        <Col xs={8} className="text-center mb-0">
          {getRecordRange(
            producePage,
            indexOfFirstProduce,
            indexOfLastProduce,
            "생산 외형",
          )}
        </Col>
        <Col xs={2}>
          <div className="justify-content-end d-flex mb-1">
            <Button
              onClick={() => openProduceModal(dummyProduce)}
              className="d-inline-flex align-items-center"
            >
              <BsPlusSquareFill />
            </Button>
          </div>
        </Col>
      </Row>

      <div className="produce-table-container">
        <Table
          id="workerJobTable"
          bordered
          hover
          striped
          style={{
            minWidth: "730px",
          }}
        >
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
          <tbody>
            {produceRows.map((produce, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{produce.shape}</td>
                <td>{produce.quantity}</td>
                <td>{produce.produceDate}</td>
                <td>{produce.producerName} ({produce.producerId})</td>
                <td>{produce.registerName} ({produce.registerId})</td>
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
        </Table>
      </div>

      <ProduceInfoModal
        show={showInfoModal}
        closer={() => setShowInfoModal(false)}
        produceInfo={produceInfo}
        setProduceInfo={setProduceInfo}
        setParentSuccessMsg={setSuccessMsg}
        setParentAlertSuccess={setAlertSuccess}
        loadProducePage={loadProducePage}
        setCurrentPage={setCurrentPage}
      />
      <div className="pb-1">
        <Paginator
          pageSize={producePerPage}
          totalItems={producePage.totalElements}
          totalPages={totalPages}
          currPage={currentPage}
          setCurrPage={(pageNo) => setCurrentPage(pageNo)}
          darkBackground="true"
        />
      </div>
    </div>
  );
};

export default RegisterProduce;
