import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  fetchReview,
  getReviewPage,
  patchOrderReview,
} from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import "../../pay_toss/MyOrdersPage.css";
import ReviewModal from "../../review/ReviewModal";
import { getRecordRange } from "../../util/utilities";
import "./MyReviewsPage.css";
import MyReviewsTable from "./MyReviewsTable";

const MyReviewsPage = ({ setShowDetail, setDetailId }) => {
  const [totalPages, setTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState({});
  const [reviews, setReviews] = useState([]);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

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

  return (
    <Row className="justify-content-center mt-3">
      <Col id="myReviewPage">
        <Card>
          <Card.Body>
            <ReviewModal
              show={showReviewModal}
              handleClose={() => setShowReviewModal(false)}
              title={"후기 관리"}
              review={review}
              saveReview={saveReview}
              editable={true}
            />
            <h2 className="mb-1 ps-0">
              <strong>나의 후기 목록</strong>
            </h2>
            <div className="d-flex justify-content-center align-items-center">
              <p className="text-center text-muted mb-4">
                {getRecordRange(reviewPage, indexOfFirst, idxLastPlus1, "후기")}
              </p>
            </div>
            <div
              id="orderTable"
              style={{ whiteSpace: "initial", overflow: "auto" }}
              className="justify-content-center align-items-center"
            >
              {MyReviewsTable(reviews, manageReview)}
            </div>
            {searchResult && reviewPage && (
              <Paginator
                q
                pageSize={pageSize}
                totalItems={reviewPage.totalElements}
                totalPages={totalPages}
                currPage={currentPage}
                setCurrPage={(pageNo) => setCurrentPage(pageNo)}
              />
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default MyReviewsPage;
