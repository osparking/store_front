import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getOrderPage } from "../buy/orderService";
import Paginator from "../common/Paginator";
import { formatDate } from "../util/utilities";
import "./MyOrdersPage.css";
import { getRecordRange } from "../util/utilities";

const MyOrdersPage = ({ setShowDetail, setDetailId }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [orderArray, setOrderArray] = useState([]);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

  const savedPageNo = localStorage.getItem("ORDER_PAGE_고객");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [searchResult, setSearchResult] = useState();
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  useEffect(() => {
    localStorage.setItem("ORDER_PAGE_고객", currentPage);
    const loadOrderPage = async (loginId) => {
      const searchResult = await getOrderPage(loginId, currentPage, pageSize);
      setSearchResult(searchResult);
      if (searchResult) {
        setTotalPages(searchResult.totalPages);
        setOrderPage(searchResult.pageContent);
        setOrderArray(searchResult.pageContent.content);
        setPageSize(searchResult.pageSize);
        setCurrentPage(searchResult.currentPage);
      }
    };
    const loginId = localStorage.getItem("LOGIN_ID");
    loadOrderPage(loginId);
  }, [currentPage]);

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  function viewOrderDetail(id) {
    console.log("Clicked order ID:", id);
    setDetailId(id);
    setShowDetail(true);
    return false; // Prevent default
  }

  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-center text-muted mb-4">
          {getRecordRange(orderPage, indexOfFirst, idxLastPlus1, "주문")}
        </p>
      </div>
      <div
        id="orderTable"
        style={{ whiteSpace: "initial", overflow: "auto" }}
        className="justify-content-center align-items-center"
      >
        <Table striped bordered hover>
          <thead>
            <tr className="userTableHeader">
              <th>식별자</th>
              <th>주문명</th>
              <th>현상태</th>
              <th>수신인</th>
              <th>결제액</th>
              <th className="minDateWidth">결제일</th>
              <th>영수증</th>
            </tr>
          </thead>
          <tbody>
            {orderArray &&
              orderArray.map((order, idx) => (
                <tr key={idx}>
                  <td>{order.orderId}</td>
                  <td>
                    <a href="#" onClick={() => viewOrderDetail(order.id)}>
                      {order.orderName}
                    </a>
                  </td>
                  <td>{order.orderStatus}</td>
                  <td>{order.recipientName}</td>
                  <td>{Number(order.paymentAmount).toLocaleString()}원</td>
                  <td>{formatDate(order.paymentTime)}</td>
                  <td className="text-center">
                    <a href={order.receiptUrl} target="_blank">
                      보기
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {searchResult && orderPage && (
        <Paginator
          pageSize={pageSize}
          totalItems={orderPage.totalElements}
          totalPages={totalPages}
          currPage={currentPage}
          setCurrPage={(pageNo) => setCurrentPage(pageNo)}
        />
      )}
    </div>
  );
};

export default MyOrdersPage;
