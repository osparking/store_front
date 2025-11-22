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
    </main>
  );
};

export default ManageOrder;
