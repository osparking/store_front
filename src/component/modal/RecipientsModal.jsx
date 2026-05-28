import { useContext, useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { PayButtonContext } from "../buy/Recipient";
import Paginator from "../common/Paginator";
import { getMyRecipients } from "../user/UserService";
import "./RecipientsModal.css";

const RecipientsModal = ({ show, formData, setFormData, closer }) => {
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
        pageSize,
      );

      // console.log("recipients: ", JSON.stringify(myRecipients));
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

  const { putFocus2PayButton } = useContext(PayButtonContext) || {};
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
    closer();

    setTimeout(() => {
      if (putFocus2PayButton) {
        putFocus2PayButton();
      }
    }, 200);
  };

  return (
    <Modal show={show} onHide={closer} dialogClassName="recipients-modal">
      <div className="custom-modal-width">
        <Modal.Header closeButton>
          <Modal.Title>최근 수신처</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-3" id="my-recipients">
            <p className="text-center text-muted mb-2">
              수신처 총 {recipientPage.totalElements} 건 중, {indexOfFirst + 1}{" "}
              ~ {Math.min(idxLastPlus1, recipientPage.totalElements)}번째 수신처
            </p>

            <div className="table-container recipients">
              <Table id="recipients" bordered hover striped>
                <thead>
                  <tr>
                    <th>주소(도로명)</th>
                    <th>상세주소</th>
                    <th>성명</th>
                    <th>휴대폰</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients &&
                    recipients.map((recipient, index) => (
                      <tr key={index} style={{ cursor: "pointer" }}>
                        <td onClick={() => selectRecipient(recipient)}>
                          <p className="roadAddress">{recipient.roadAddress}</p>
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
