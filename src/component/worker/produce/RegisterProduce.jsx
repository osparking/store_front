import { useEffect, useState } from "react";
import {
  Button,
  Col,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import AlertMessage from "../../common/AlertMessage";
import Paginator from "../../common/Paginator";
import BsAlertHook from "../../hook/BsAlertHook";
import { getRecordRange } from "../../util/utilities";
import { fetchProducePage } from "./ProduceService";
import "./RegisterProduce.css";
import { BsPencilFill, BsTrashFill } from "react-icons/bs";
import { Link } from "react-router-dom";

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
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

  const [producePerPage] = useState(10);
  const indexOfLastProduce = currentPage * producePerPage;
  const indexOfFirstProduce = indexOfLastProduce - producePerPage;
  const [loading, setLoading] = useState(false);

  const loadProducePage = async () => {
    setLoading(true);
    const response = await fetchProducePage(currentPage, pageSize);
    setLoading(false);

    if (response && response.pageContent) {
      console.log("response.pageContent: ", response.pageContent);
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

  return (
    <div className="mt-3">
      <Row>
        <Col>
          {alertSuccess && (
            <AlertMessage type={"success"} message={successMsg} />
          )}
          {alertError && <AlertMessage type={"danger"} message={errorMsg} />}
        </Col>
      </Row>
      <div className="justify-content-center align-items-center">
        <p className="text-center mb-0">
          {getRecordRange(
            producePage,
            indexOfFirstProduce,
            indexOfLastProduce,
            "생산 외형",
          )}
        </p>
      </div>
      <div className="produce-table-container">
        <Table
          id="produceTable"
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
              <th>생산일</th>
              <th>생산자</th>
              <th>등록자</th>
              <th>등록일시</th>
              <th colSpan={2}>작업</th>
            </tr>
          </thead>
          <tbody>
            {produceRows.map((produce, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{produce.shape}</td>
                <td>{produce.produceDate}</td>
                <td>{produce.producerName}</td>
                <td>{produce.registerName}</td>
                <td>{produce.registerTime}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip id={`tooltip-view-${index}`}>정보 편집</Tooltip>
                    }
                  >
                    <Button
                      size="sm"
                      style={{ backgroundColor: "transparent", border: "none" }}
                      onClick={() => openWithRow(produce)}
                    >
                      <BsPencilFill className="text-success" />
                    </Button>
                  </OverlayTrigger>
                </td>
                <td>
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
                      onClick={() => handleShowDelModal(produce.id)}
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
      <div className="pb-1">
        <Paginator
          pageSize={producePerPage}
          totalItems={producePage.totalElements}
          totalPages={totalPages}
          currPage={currentPage}
          setCurrPage={(pageNo) => changePage(pageNo)}
          darkBackground="true"
        />
      </div>
    </div>
  );
};

export default RegisterProduce;
