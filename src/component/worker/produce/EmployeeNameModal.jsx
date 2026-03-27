import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Modal,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Paginator from "../../common/Paginator";
import "./EmployeeNameModal.css";
import { useDebounce } from "../../util/utilities";
import { getEmployeeNamesPage } from "../WorkerService";
import ProcessSpinner from "../../common/ProcessSpinner";

const EmployeeNameModal = ({
  show,
  producerName,
  setEmpName,
  closer,
  //   putFocus2detailedAddr,
}) => {
  const [nameKey, setNameKey] = useState(producerName);
  const [names, setNames] = useState([]);
  const [namePage, setNamePage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage
  const [loading, setLoading] = useState(false);

  const [searchResult, setSearchResult] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setNameKey(producerName);
  }, [producerName]);
  
  //   useEffect(() => {
  //     if (searchResult && searchResult.pageContent) {
  //       setAddresses(searchResult.pageContent.content);
  //       setAddrPage(searchResult.pageContent);
  //       setPageSize(searchResult.pageSize);
  //       setTotalPages(searchResult.totalPages);
  //     }
  //   }, [searchResult]);

  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadNamesPage = async (value) => {
    try {
      console.log("직원명 페이지 로딩 중");
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
        setNames(searchResult.pageContent.content);
        setNamePage(searchResult.pageContent);
        setTotalPages(searchResult.totalPages);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  //   useEffect(() => {
  //     loadAddressPage(nameKey);
  //   }, [currentPage]);

  //   const selectAddress = (addr) => {
  //     const addrBasisAddReq = {
  //       zipcode: addr.zipcode,
  //       roadAddress: addr.roadAddress,
  //       zbunAddress: addr.zbunAddress,
  //     };
  //     console.log("addrBasisAddReq: ", addrBasisAddReq);
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       addrBasisAddReq: addrBasisAddReq,
  //     }));

  //     if (formData.addrBasisAddReq.roadAddress !== addr.roadAddress) {
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         addressDetail: "",
  //       }));

  //       putFocus2detailedAddr();
  //     }

  //     closer();
  //   };

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
          <div className="mt-5">
            <p className="text-center text-muted mb-4">
              직원 총 {namePage.totalElements} 명 중, {indexOfFirst + 1} ~{" "}
              {Math.min(idxLastPlus1, namePage.totalElements)}번째 이름
            </p>

            <div className="table-container">
              <Table bordered hover striped>
                <thead>
                  <tr>
                    <th>직원명-ID</th>
                  </tr>
                </thead>
                <tbody>
                  {names &&
                    names.map((name, index) => (
                      <tr
                        key={index}
                        onClick={() => selectAddress(name)}
                        style={{ cursor: "pointer" }}
                      >
                        <td className="small">{name.zipcode}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
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

export default EmployeeNameModal;
