import { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import Paginator from "../common/Paginator";
import "./RecipientsModal.css";
import { getMyRecipients } from "../user/UserService";

const RecipientsModal = ({
  show,
  formData,
  setFormData,
  closer,
  putFocus2detailedAddr,
}) => {
  const [recipients, setRecipients] = useState([]);
  const [recipientPage, setRecipientPage] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

  const [fetchResult, setFetchResult] = useState({});
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (fetchResult && fetchResult.pageContent) {
      setRecipients(fetchResult.pageContent.content);
      setRecipientPage(fetchResult.pageContent);
      setPageSize(fetchResult.pageSize);
      setTotalPages(fetchResult.totalPages);
    }
  }, [fetchResult]);

  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadRecipientPage = async (value) => {
    const userJson = localStorage.getItem("USER");
    const user = JSON.parse(userJson);

    try {
      const myRecipients = await getMyRecipients(
        user.id,
        currentPage,
        pageSize
      );

      console.log("recipients: ", JSON.stringify(myRecipients));
      setFetchResult(myRecipients);
      if (myRecipients && myRecipients.pageContent) {
        setRecipients(myRecipients.pageContent.content);
        setRecipientPage(myRecipients.pageContent);
        setTotalPages(myRecipients.totalPages);
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  useEffect(() => {
    loadRecipientPage();
  }, [currentPage]);

  const selectRecipient = (recipient) => {
    setFormData({
      addressDetail: recipient.addressDetail,
      doroZbun: recipient.doroZbun,
      addrBasisAddReq: {
        zipcode: recipient.zipcode,
        roadAddress: recipient.roadAddress,
        zbunAddress: recipient.zbunAddress,
      },
      mbPhone: recipient.mbPhone,
      fullName: recipient.fullName,
    });

    if (formData.addrBasisAddReq.roadAddress !== recipient.roadAddress) {
      setFormData((prevState) => ({
        ...prevState,
        addressDetail: "",
      }));

      putFocus2detailedAddr();
    }

    closer();
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName="custom-modal">
      <div className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>나의 수신처</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-5">
            <p className="text-center text-muted mb-4">
              수신처 총 {recipientPage.totalElements} 건 중, {indexOfFirst + 1}{" "}
              ~ {Math.min(idxLastPlus1, recipientPage.totalElements)}번째 수신처
            </p>

            <div className="table-container">
              <Table bordered hover striped>
                <thead>
                  <tr>
                    <th className="w400">주소(도로명)</th>
                    <th>상세주소</th>
                    <th>성명</th>
                    <th>휴대폰</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients &&
                    recipients.map((recipient, index) => (
                      <tr key={index}>
                        <td
                          className="small w400"
                          onClick={() => selectRecipient(recipient)}
                        >
                          <p className="above">{recipient.roadAddress}</p>
                        </td>
                        <td className="small">{recipient.addressDetail}</td>
                        <td className="small">{recipient.fullName}</td>
                        <td className="small">{recipient.mbPhone}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </div>
            {fetchResult && recipientPage && (
              <Paginator
                pageSize={recipientPage.size}
                totalItems={recipientPage.totalElements}
                totalPages={totalPages}
                currPage={fetchResult.currentPage}
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

export default RecipientsModal;
