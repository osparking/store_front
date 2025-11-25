import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../../../App.css";
import { fetchOrderPage, getOrderStatusList } from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import { formatDate } from "../../util/utilities";
import OrderStatus from "./OrderStatus";

const OrderTable = ({ setShowDetail, setDetailId }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [soapOrders, setSoapOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10); // itemsPerPage
  const [currentPage, setCurrentPage] = useState(1);

  const [fetchResult, setFetchResult] = useState();
  const [loading, setLoading] = useState(false);
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const [statusLabels, setStatusLabels] = useState([]);

  useEffect(() => {
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
    loadOrderPage();
  }, [currentPage]);

  function viewOrderDetail(id) {
    console.log("Clicked order ID:", id);
    setDetailId(id);
    setShowDetail(true);
    return false; // Prevent default
  }

  return (
    <div className="mt-3">
      <p className="text-center mb-4">
        주문 총 {orderPage.totalElements} 건 중, {indexOfFirst + 1} ~{" "}
        {Math.min(idxLastPlus1, orderPage.totalElements)}번째 주문
      </p>

      <div className="table-container">
        <Table bordered hover striped>
          <thead>
            <tr>
              <th>주문일시</th>
              <th>상태</th>
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
                  <td>
                    <OrderStatus
                      statusLabels={statusLabels}
                      value={order.orderStatus}
                      soapOrders={soapOrders}
                      orderIndex={index}
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
