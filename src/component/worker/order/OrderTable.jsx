import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../../../App.css";
import { fetchOrderPage, getOrderStatusList } from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import { formatDate, getRecordRange } from "../../util/utilities";
import OrderStatus from "./OrderStatus";
import "./OrderTable.css";

const OrderTable = ({ setShowDetail, setDetailId }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [soapOrders, setSoapOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10); // itemsPerPage

  const savedPageNo = localStorage.getItem("ORDER_PAGE_WORKER");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [fetchResult, setFetchResult] = useState();
  const [loading, setLoading] = useState(false);
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const [statusLabels, setStatusLabels] = useState([]);

  const loadOrderPage = async () => {
    setLoading(true);
    const response = await fetchOrderPage(currentPage, pageSize);
    setLoading(false);
    setFetchResult(response);

    if (response && response.pageContent) {
      setTotalPages(response.totalPages);
      setOrderPage(response.pageContent);
      setSoapOrders(response.pageContent.content);
      setPageSize(response.pageSize);
      setCurrentPage(response.currentPage);
    }

    const statuses = await getOrderStatusList();
    setStatusLabels(statuses.data);
  };

  useEffect(() => {
    localStorage.setItem("ORDER_PAGE_WORKER", currentPage);
    loadOrderPage();
  }, [currentPage]);

  function viewOrderDetail(id) {
    console.log("Clicked order ID:", id);
    setDetailId(id);
    setShowDetail(true);
    return false; // Prevent default
  }

  const getStatusClass = (orderStatus) => {
    switch (orderStatus) {
      case "결제완료":
        return "status-paid";
      case "발주확인":
        return "status-confirmed";
      default:
        return "status-default";
    }
  };

  return (
    <div className="mt-3">
      <p className="text-center mb-1">
        {getRecordRange(orderPage, indexOfFirst, idxLastPlus1, "주문")}
      </p>
      <div className="order-table-container">
        <Table bordered hover striped style={{ minWidth: "730px" }}>
          <thead>
            <tr>
              <th className="minDateWidth">주문일시</th>
              <th style={{ minWidth: "125px" }}>상태</th>
              <th>주문명칭</th>
              <th>고객명</th>
              <th>수신자</th>
              <th>지불액</th>
              <th>주문ID</th>
              <th>유저ID</th>
            </tr>
          </thead>
          <tbody>
            {soapOrders &&
              soapOrders.map((order, index) => (
                <tr key={index}>
                  <td>{formatDate(order.orderTime)}</td>
                  <td className={getStatusClass(order.orderStatus)}>
                    <OrderStatus
                      statusLabels={statusLabels}
                      order={order}
                      loadOrderPage={loadOrderPage}
                    />
                  </td>
                  <td>
                    <a href="#" onClick={() => viewOrderDetail(order.id)}>
                      {order.orderName}
                    </a>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.recipient}</td>
                  <td>{Number(order.payment).toLocaleString()}원</td>
                  <td>{order.orderId}</td>
                  <td>{order.user_id}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {fetchResult && orderPage && (
        <Paginator
          pageSize={orderPage.size}
          totalItems={orderPage.totalElements}
          totalPages={totalPages}
          currPage={fetchResult.currentPage}
          setCurrPage={(pageNo) => setCurrentPage(pageNo)}
          darkBackground="true"
        />
      )}
    </div>
  );
};

export default OrderTable;
