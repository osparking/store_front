import { useContext, useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../App.css";
import {
  fetchReview,
  getReviewPage,
  patchOrderReview,
} from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import "../../home/home.css";
import "../../pay_toss/MyOrdersPage.css";
import ReviewModal from "../../review/ReviewModal";
import { getRecordRange } from "../../util/utilities";
import OrderDetail from "../../worker/order/OrderDetail";
import { ReviewsContext } from "../UserDashboard";
import "./MyReviewsPage.css";
import MyReviewsTable from "./MyReviewsTable";

const MyReviewsPage = () => {
  const { reviewsVersion } = useContext(ReviewsContext);
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

  const navigate = useNavigate();

  const goHome = () => {
    navigate("/");
  };

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({});

  const manageReview = async (review) => {
    const reviewInfo = await fetchReview(review.id);
    setReview({ ...reviewInfo, id: review.id, reviewTime: review.reviewTime });
    setShowReviewModal(true);
  };

  const saveReview = async (reviewData) => {
    setShowReviewModal(false);
    await patchOrderReview(reviewData);
    loadReviewPage();
  };

  const [showDetail, setShowDetail] = useState(false);
  const [detailId, setDetailId] = useState(0);

  const closeMyReviewModal = (reloadReviews) => {
    reloadReviews && loadReviewPage();
    setShowReviewModal(false);
  };

  return (
    <>
      {showDetail ? (
        <OrderDetail
          detailId={detailId}
          setShowDetail={setShowDetail}
          isHouse={false}
        />
      ) : (
        <>
          <ReviewModal
            show={showReviewModal}
            handleClose={closeMyReviewModal}
            title={"후기 관리"}
            review={review}
            saveReview={saveReview}
            editable={true}
          />
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
                  {getRecordRange(
                    reviewPage,
                    indexOfFirst,
                    idxLastPlus1,
                    "후기",
                  )}
                </p>
                <div
                  style={{ overflow: "auto" }}
                  className="align-items-center justify-content-center"
                >
                  {MyReviewsTable(reviews, manageReview)}
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
        </>
      )}
    </>
  );
};

export default MyReviewsPage;
