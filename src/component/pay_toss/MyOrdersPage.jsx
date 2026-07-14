import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrderPage } from "../buy/orderService";
import Paginator from "../common/Paginator";
import "../user/userDashboard.css";
import { formatDate, getRecordRange } from "../util/utilities";
import "./MyOrdersPage.css";
import { ReviewsContext } from "../user/UserDashboard";

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

  const reviewContext = useContext(ReviewsContext);
  let ordersVersion = reviewContext?.ordersVersion || undefined;
  const loginId = localStorage.getItem("LOGIN_ID");

  useEffect(() => {
    localStorage.setItem("ORDER_PAGE_고객", currentPage);
    const loadOrderPage = async () => { // 인자 제거됨
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
    loadOrderPage();
  }, [currentPage, ordersVersion]);

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
        <col style={{ width: "17%" }} />
        <col style={{ width: "14%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "08%" }} />
        <col style={{ width: "10%" }} />
        <col style={{ width: "19%" }} />
        <col style={{ width: "07%" }} />
      </colgroup>
    );
  };

  const orderTableWidth = "780px";

  return (
    <>
      <p className="text-center mb-1">
        {getRecordRange(orderPage, indexOfFirst, idxLastPlus1, "주문")}
      </p>
      <div style={{ overflow: "auto" }} className="d-flex align-items-center">
        <div className="user-table-wrapper">
          <div className="table-header">
            <table
              className="table table-bordered table-hover table-striped"
              style={{
                tableLayout: "fixed",
                minWidth: orderTableWidth,
                width: orderTableWidth,
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
                minWidth: orderTableWidth,
                width: orderTableWidth,
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
