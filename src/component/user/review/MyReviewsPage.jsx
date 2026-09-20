import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import "../../../App.css";
import { getReviewPage } from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import "../../home/home.css";
import "../../pay_toss/MyOrdersPage.css";
import { getRecordRange } from "../../util/utilities";
import OrderDetailEdit from "../../worker/order/OrderDetailEdit";
import { useDashboard } from "../dashboard/DashboardContext";
import "./MyReviewsPage.css";
import MyReviewsTable from "./MyReviewsTable";

const MyReviewsPage = () => {
  const { reviewsVersion } = useDashboard();
  const [totalPages, setTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState({});
  const [reviews, setReviews] = useState([]);
  const [pageSize, setPageSize] = useState(10); // itemsPerPage

  const savedPageNo = localStorage.getItem("REVIEW_PAGE_고객");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [searchResult, setSearchResult] = useState();
  const idxLastPlus1 = currentPage * pageSize;
  const indexOfFirst = idxLastPlus1 - pageSize;

  const loadReviewPage = async () => {
    const searchResult = await getReviewPage(currentPage, pageSize);
    setSearchResult(searchResult);
    if (searchResult) {
      setTotalPages(searchResult.totalPages);
      setReviewPage(searchResult.pageContent);
      setReviews(searchResult.pageContent.content);
      setPageSize(searchResult.pageSize);
      setCurrentPage(searchResult.currentPage);
    }
  };

  useEffect(() => {
    loadReviewPage();
  }, [reviewsVersion]);

  useEffect(() => {
    localStorage.setItem("REVIEW_PAGE_고객", currentPage);
    loadReviewPage();
  }, [currentPage]);

  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  return (
    <>
      {showDetail ? (
        <OrderDetailEdit
          detailId={detailId}
          setShowDetail={setShowDetail}
        />
      ) : (
        <div
          className="justify-content-center align-items-center my-card-container"
          style={{ display: "flex", width: "100%" }}
        >
          <Card className="tableCard">
            <Card.Body style={{ width: "100%" }}>
              <h2 className="mb-1 ps-0">
                <strong>나의 후기 목록</strong>
              </h2>
              <p className="text-center text-muted mb-2">
                {getRecordRange(reviewPage, indexOfFirst, idxLastPlus1, "후기")}
              </p>
              <div
                style={{ overflow: "auto" }}
                className="align-items-center justify-content-center"
              >
                {MyReviewsTable(reviews)}
              </div>
              {searchResult && reviewPage && (
                <Paginator
                  pageSize={pageSize}
                  totalItems={reviewPage.totalElements}
                  totalPages={totalPages}
                  currPage={currentPage}
                  setCurrPage={(pageNo) => setCurrentPage(pageNo)}
                />
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </>
  );
};

export default MyReviewsPage;
