import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderPage } from "../buy/orderService";
import Paginator from "../common/Paginator";
import { formatDate, getRecordRange } from "../util/utilities";
import "./MyOrdersPage.css";
import "../user/userDashboard.css";

const MyOrdersPage = ({ setShowDetail, setDetailId }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [orderArray, setOrderArray] = useState([]);
  const [pageSize, setPageSize] = useState(10); // itemsPerPage

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

  const orderTableColumnGroup = () => {
    return (
      <colgroup>
        <col style={{ width: "15%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "08%" }} />
        <col style={{ width: "07%" }} />
        <col style={{ width: "08%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "06%" }} />
      </colgroup>
    );
  };

  return (
    <>
      <p className="text-center mb-1">
        {getRecordRange(orderPage, indexOfFirst, idxLastPlus1, "주문")}
      </p>
      <div style={{ overflow: "auto" }}>
        <div className="user-table-wrapper">
          <div className="table-header">
            <table
              className="table table-bordered table-hover table-striped"
              style={{
                tableLayout: "fixed",
                minWidth: "730px",
              }}
            >
              {orderTableColumnGroup()}
              <thead>
                <tr>
                  <th>식별자</th>
                  <th>주문명</th>
                  <th>현상태</th>
                  <th>수신인</th>
                  <th>결제액</th>
                  <th className="minDateWidth">결제일</th>
                  <th>영수증</th>
                </tr>
              </thead>
            </table>
          </div>

          <div className="table-body my-order">
            <table
              className="table table-bordered table-hover table-striped"
              style={{
                tableLayout: "fixed",
                minWidth: "730px",
              }}
            >
              {orderTableColumnGroup()}
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
            </table>
          </div>
        </div>
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
    </>
  );
};

export default MyOrdersPage;
