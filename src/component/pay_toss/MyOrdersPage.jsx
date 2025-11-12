import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { formatDate } from "../util/utilities";
import "./MyOrdersPage.css";
import Paginator from "../common/Paginator";
import { getOrderPage } from "../buy/orderService";

const MyOrdersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [orderArray, setOrderArray] = useState([]);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage
  const [currentPage, setCurrentPage] = useState(1);

  const [searchResult, setSearchResult] = useState(location.state?.data.data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchResult && searchResult.pageContent) {
      setTotalPages(searchResult.totalPages);
      setOrderPage(searchResult.pageContent);
      setOrderArray(searchResult.pageContent.content);
      setPageSize(searchResult.pageSize);
      setCurrentPage(searchResult.currentPage);
    }
  }, [searchResult]);

  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  useEffect(() => {
    const loadOrderPage = async (loginId) => {
      setLoading(true);
      const searchResult = await getOrderPage(loginId, currentPage, pageSize);
      setLoading(false);
      setSearchResult(searchResult);
      if (searchResult && searchResult.addressPage) {
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

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="box_section orders_table_div">
      <div className="d-flex justify-content-center align-items-center">
        <h3>나의 주문 목록</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-center text-muted mb-4">
          주문 총 {orderPage.totalElements} 건 중, {indexOfFirst + 1} ~{" "}
          {Math.min(idxLastPlus1, orderPage.totalElements)}번째 주소
        </p>
      </div>
      <div
        id="orderTable"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>식별자</th>
              <th>주문명</th>
              <th>수신인</th>
              <th>결제액</th>
              <th>결제일</th>
              <th>영수증</th>
            </tr>
          </thead>
          <tbody>
            {orderArray &&
              orderArray.map((order, idx) => (
                <tr key={idx}>
                  <td>{order.orderId}</td>
                  <td>
                    <a href="#">{order.orderName}</a>
                  </td>
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
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="info"
          onClick={() => goHome()}
          style={{ marginTop: "30px" }}
        >
          범이비누
        </Button>
      </div>
    </div>
  );
};

export default MyOrdersPage;
