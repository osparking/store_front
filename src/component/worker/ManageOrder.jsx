import { useEffect, useState } from "react";
import "../../App.css";
import { fetchOrderPage } from "../buy/orderService";
import { Table } from "react-bootstrap";
import Paginator from "../common/Paginator";
import { formatDate } from "../util/utilities";
const ManageOrder = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [orderPage, setOrderPage] = useState({});
  const [soapOrders, setSoapOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10); // itemsPerPage
  const [currentPage, setCurrentPage] = useState(1);

  const [fetchResult, setFetchResult] = useState();
  const [loading, setLoading] = useState(false);
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  useEffect(() => {
    const loadOrderPage = async () => {
      setLoading(true);
      const response = await fetchOrderPage(currentPage, pageSize);
      console.log("response: ", JSON.stringify(response));
      setLoading(false);
      setFetchResult(response);

      if (response && response.pageContent) {
        setTotalPages(response.totalPages);
        setOrderPage(response.pageContent);
        setSoapOrders(response.pageContent.content);
        setPageSize(response.pageSize);
        setCurrentPage(response.currentPage);
      }
    };
    loadOrderPage();
  }, []); // currentPage

  return (
    <main>
      <h5 className="chart-title">주문 관리</h5>
      <div className="mt-5">
        <p className="text-center text-muted mb-4">
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
            </tbody>
          </Table>
        </div>
      </div>
    </main>
  );
};

export default ManageOrder;
