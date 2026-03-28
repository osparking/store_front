import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  Modal,
  OverlayTrigger,
  Row,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Paginator from "../../common/Paginator";
import ProcessSpinner from "../../common/ProcessSpinner";
import { useDebounce } from "../../util/utilities";
import { getEmployeeNamesPage } from "../WorkerService";
import "./ProducerModal.css";

const ProducerModal = ({
  show,
  producer,
  setProducer,
  closer,
}) => {
  const [nameKey, setNameKey] = useState(producer.name);
  const [employees, setEmployees] = useState([]);
  const [namePage, setNamePage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage
  const [loading, setLoading] = useState(false);
  
  const [searchResult, setSearchResult] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setNameKey(producer.name);
    loadNamesPage(producer.name);
  }, [producer]);

  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadNamesPage = async (value) => {
    if (!show) return; // 모달이 열려있지 않으면 API 호출하지 않음
    try {
      setLoading(true);
      const searchResult = await getEmployeeNamesPage(
        value,
        currentPage,
        pageSize,
      );
      setLoading(false);
      setSearchResult(searchResult);
      if (searchResult && searchResult.pageContent) {
        console.log("names: ", searchResult.pageContent.content);
        setEmployees(searchResult.pageContent.content);
        setNamePage(searchResult.pageContent);
        setTotalPages(searchResult.totalPages);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    loadNamesPage(nameKey);
  }, [currentPage]);

  useEffect(() => {
    loadNamesPage(nameKey);
  }, [show]);

  const selectProducer = (producer) => {
    console.log("producer: ", producer);
    setProducer(producer);
    setNameKey(producer.name);
    closer();
  };

  const keyNotEnough = () => !nameKey || nameKey.length === 0;

  function MyButton() {
    useEffect(() => {
      const handleKeyPress = (event) => {
        if ((event.altKey || event.metaKey) && event.key === "s") {
          event.preventDefault(); // Prevent browser save dialog
          setCurrentPage(1);
          debouncedPageLoad(nameKey);
        }
      };
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }, [currentPage]);
    if (loading) {
      return (
        <Button
          disabled={keyNotEnough()}
          variant="outline-primary"
          type="submit"
          className="w-25 ms-2"
          style={{ width: "50vw" }}
        >
          <ProcessSpinner message="로딩" />
        </Button>
      );
    } else {
      return (
        <Button
          disabled={keyNotEnough()}
          variant="outline-primary"
          type="button"
          className="ms-2"
          onClick={handleNameKey}
        >
          <FaMagnifyingGlass />
          <span className="shourcut">(Alt+S)</span>
        </Button>
      );
    }
  }

  const handleNameKey = () => {
    setCurrentPage(1);
    debouncedPageLoad(nameKey);
  };

  const debouncedPageLoad = useDebounce(loadNamesPage, 200);

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === "Process") {
      event.preventDefault();
      debouncedPageLoad(nameKey);
    }
  };

  const handleKeyUp = (event) => {
    // if (event.key === "Process") {
    //   event.preventDefault();
    //   handleNameKey();
    // }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNameKey(value);
    if (value.trim().length > 4) {
      debouncedPageLoad(value.trim());
    }
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName="address-modal">
      <div className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>직원 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex justify-content-center">
              <OverlayTrigger overlay={<Tooltip>한 글자 이상 입력!</Tooltip>}>
                <Form.Control
                  type="text"
                  name="nameKey"
                  placeholder="(직원명)"
                  value={nameKey}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyUp}
                  maxLength={5}
                  style={{ width: "100px" }}
                />
              </OverlayTrigger>
              <MyButton />
            </div>
          </Form>
          <div className="mt-4">
            {namePage.totalElements > 0 && (
              <p className="text-center text-muted mb-2">
                직원 {namePage.totalElements} 명 중, {indexOfFirst + 1} ~{" "}
                {Math.min(idxLastPlus1, namePage.totalElements)}번째
              </p>
            )}
            <div className="mt-0 justify-content-center">
              {namePage.totalElements === 0 ? (
                <p className="text-center text-muted mb-2">해당 직원 없음</p>
              ) : (
                <Row className="justify-content-center">
                  <Col xs={8} md={5}>
                    <Table bordered hover striped>
                      <thead>
                        <tr>
                          <th>직원명-ID</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees &&
                          employees.map((employee, index) => (
                            <tr
                              key={index}
                              onClick={() => selectProducer(employee)}
                              style={{ cursor: "pointer" }}
                            >
                              <td className="small">{employee.name}</td>
                            </tr>
                          ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}
            </div>
            {searchResult && namePage && (
              <Paginator
                pageSize={namePage.size}
                totalItems={namePage.totalElements}
                totalPages={totalPages}
                currPage={searchResult.currentPage}
                setCurrPage={(pageNo) => setCurrentPage(pageNo)}
              />
            )}
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ProducerModal;
