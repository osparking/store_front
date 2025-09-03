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
import { useNavigate } from "react-router-dom";
import Paginator from "../common/Paginator";
import ProcessSpinner from "../common/ProcessSpinner";
import "./AddressModal.css";
import { searchAddress } from "./orderService";

const AddressModal = ({ show, setFormData, closer }) => {
  const [addressKey, setAddressKey] = useState("미사강변북로");
  const [addresses, setAddresses] = useState([]);
  const [addrPage, setAddrPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5); // itemsPerPage
  const [loading, setLoading] = useState(false);

  const [searchResult, setSearchResult] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchResult && searchResult.addressPage) {
      setAddresses(searchResult.addressPage.content);
      setAddrPage(searchResult.addressPage);
      setTotalPages(searchResult.totalPages);
    }
  }, [searchResult]);

  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadAddressPage = async () => {
    setLoading(true);
    const searchResult = await searchAddress(addressKey, currentPage, pageSize);
    setLoading(false);
    setSearchResult(searchResult);
    if (searchResult && searchResult.addressPage) {
      setAddresses(searchResult.addressPage.content);
      setAddrPage(searchResult.addressPage);
      setTotalPages(searchResult.totalPages);
    }

    // //Simulate API call delay time, but, only in debug mode
    // if (process.env.NODE_ENV === "development") {
    //   setTimeout(() => {
    //     console.log("loading delay is being simulated");
    //     setLoading(false);
    //   }, 100);
    // }
  };

  useEffect(() => {
    loadAddressPage();
  }, [currentPage]);

  const selectAddress = (addr) => {
    const addrBasisAddReq = {
      zipcode: addr.zipcode,
      roadAddress: addr.roadAddress,
      zBunAddress: addr.zbunAddress,
    };
    console.log("addrBasisAddReq: ", addrBasisAddReq);
    setFormData((prevState) => ({
      ...prevState,
      addrBasisAddReq: addrBasisAddReq,
    }));
    closer();
  }; 

  const keyNotEnough = () => {
    return addressKey.length < 5;
  };

  function MyButton() {
    useEffect(() => {
      const handleKeyPress = (event) => {
        if ((event.altKey || event.metaKey) && event.key === "s") {
          event.preventDefault(); // Prevent browser save dialog
          setCurrentPage(1);
          loadAddressPage();
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
          type="submit"
          className="w-25 ms-2"
          style={{ width: "50vw" }}
        >
          <FaMagnifyingGlass />
          <span className="shourcut">(Alt+S)</span>
        </Button>
      );
    }
  }

  const handleAddressKey = () => {
    setCurrentPage(1);
    loadAddressPage();
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName="custom-modal">
      <div className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>주소 검색</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddressKey}>
            <div className="d-flex">
              <OverlayTrigger overlay={<Tooltip>5 글자 이상 입력!</Tooltip>}>
                <Form.Control
                  type="text"
                  name="addressKey"
                  placeholder="(주소 일부)"
                  value={addressKey}
                  onChange={(e) => setAddressKey(e.target.value)}
                />
              </OverlayTrigger>
              <MyButton />
            </div>
          </Form>
          <div className="mt-5">
            <p className="text-center text-muted mb-4">
              주소 총 {addrPage.totalElements} 건 중, {indexOfFirst + 1} ~{" "}
              {Math.min(idxLastPlus1, addrPage.totalElements)}번째 주소
            </p>

            <div className="table-container">
              <Table bordered hover striped>
                <thead>
                  <tr>
                    <th>우편번호</th>
                    <th>
                      주소(<span className="thickFont">도로명</span>/지번)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {addresses &&
                    addresses.map((addr, index) => (
                      <tr key={index}>
                        <td className="small">{addr.zipcode}</td>
                        <td onClick={() => selectAddress(addr)}>
                          <p className="above">{addr.roadAddress}</p>
                          <p className="below">{addr.zbunAddress}</p>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            {searchResult && addrPage && (
              <Paginator
                addresses={addresses}
                pageSize={addrPage.size}
                totalItems={addrPage.totalElements}
                totalPages={totalPages}
                currPage={searchResult.currentPage}
                setCurrPage={(pageNo) => setCurrentPage(pageNo)}
              />
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </div>
    </Modal>
  );
};

export default AddressModal;
