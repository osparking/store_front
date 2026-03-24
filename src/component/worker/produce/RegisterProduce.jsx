import { useEffect, useState } from "react";
import {
    Col,
    Row
} from "react-bootstrap";
import AlertMessage from "../../common/AlertMessage";
import Paginator from "../../common/Paginator";
import BsAlertHook from "../../hook/BsAlertHook";
import { getRecordRange } from "../../util/utilities";
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
            "비누",
          )}
        </p>
      </div>
      <div className="ingredient-table-container">
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
