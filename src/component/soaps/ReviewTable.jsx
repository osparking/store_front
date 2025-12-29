import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import "../../App.css";
import {
  fetchReview,
  fetchReviewPage,
  fetchAverageStars,
} from "../buy/orderService";
import "./ReviewTable.css";
import Paginator from "../common/Paginator";
import { formatDate } from "../util/utilities";
import ReviewModal from "../review/ReviewModal";
import RatingAvg from "../review/RatingAvg";

const ReviewTable = () => {
  const [totalPages, setTotalPages] = useState(1);
  const [reviewPage, setReviewPage] = useState({});
  const [reviews, setReviews] = useState([]);
  const [pageSize, setPageSize] = useState(5); // itemsPerPage

  const savedPageNo = localStorage.getItem("REVIEW_PAGE_CUSTOMER");
  const [currentPage, setCurrentPage] = useState(savedPageNo || 1);

  const [fetchResult, setFetchResult] = useState();
  const [averageStars, setAverageStars] = useState(0);

  useEffect(() => {
    const getAverageStars = async () => {
      const response = await fetchAverageStars();
      setAverageStars(response);
    };
    getAverageStars();
  }, []);

  useEffect(() => {
    localStorage.setItem("REVIEW_PAGE_CUSTOMER", currentPage);
    const loadReviewPage = async () => {
      const response = await fetchReviewPage(currentPage, pageSize);
      setFetchResult(response);

      if (response && response.pageContent) {
        setTotalPages(response.totalPages);
        setReviewPage(response.pageContent);
        setReviews(response.pageContent.content);
        setPageSize(response.pageSize);
        setCurrentPage(response.currentPage);
      }
    };
    loadReviewPage();
  }, [currentPage]);

  async function viewReviewDetail(oId) {
    // 주문 ID(순수 번호)
    const review = await fetchReview(oId);
    setReview({ ...review, id: oId });
    setShowReviewModal(true);
  }

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({});

  return (
    <div className="box_section review_table_div" style={{ overflowX: "auto" }}>
      <ReviewModal
        show={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
        title={"후기 읽기"}
        order={review}
        editable={false}
      />
      <h5 className="chart-title pinkBack">고객 구매 후기</h5>
      <p className="text-center mb-0 mt-4">
        <RatingAvg rating={averageStars} />(
        {parseFloat(averageStars.toFixed(2))}, {reviewPage.totalElements}건
        평균)
      </p>

      <div className="table-container">
        <Table bordered hover striped>
          <thead>
            <tr>
              <th>주문 시점</th>
              <th>후기 작성/갱신 일시</th>
              <th>별점</th>
              <th>후기 시작 부분</th>
              <th>비누 외형</th>
              <th>사진</th>
              <th>유튜브</th>
            </tr>
          </thead>
          <tbody>
            {reviews &&
              reviews.map((review, index) => (
                <tr key={index}>
                  <td>{review.orderTime} 일전</td>
                  <td>{formatDate(review.reviewTime)}</td>
                  <td>{review.stars}</td>
                  <td
                    style={{ cursor: "pointer" }}
                    className="text-start linkLook text-primary"
                    onClick={() => viewReviewDetail(review.id)}
                  >
                    {review.reviewPreview}
                  </td>
                  <td>{review.shapesList}</td>
                  <td>{review.hasImage ? "있음" : ""}</td>
                  <td>{review.hasVideo ? "있음" : ""}</td>
                </tr>
              ))}
          </tbody>
        </Table>
      </div>
      {fetchResult && reviewPage && (
        <Paginator
          pageSize={reviewPage.size}
          totalItems={reviewPage.totalElements}
          totalPages={totalPages}
          currPage={fetchResult.currentPage}
          setCurrPage={(pageNo) => setCurrentPage(pageNo)}
          darkBackground="true"
        />
      )}
    </div>
  );
};

export default ReviewTable;
