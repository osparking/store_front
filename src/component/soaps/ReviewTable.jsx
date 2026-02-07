import { useEffect, useState } from "react";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import "../../App.css";
import {
  fetchAverageStars,
  fetchReview,
  fetchReviewPage,
} from "../buy/orderService";
import Paginator from "../common/Paginator";
import RatingAvg from "../review/RatingAvg";
import ReviewModal from "../review/ReviewModal";
import "./ReviewTable.css";

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

  async function viewReviewDetail(oId, customerName, reviewTime) {
    // 주문 ID(순수 번호)
    const review = await fetchReview(oId);
    setReview({
      ...review,
      id: oId,
      customerName: customerName,
      reviewTime: reviewTime,
    });
    setShowReviewModal(true);
  }

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({});

  return (
    <Container fluid className="home-container mt-5">
      <ReviewModal
        show={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
        title={"후기 읽기"}
        review={review}
        editable={false}
      />
      <Row className="justify-content-center mt-3">
        <Col id="reviewTable">
          <Card>
            <Card.Body>
              <h2 className="mb-1 ps-0">
                <strong>고객 구매 후기</strong>
              </h2>
              <div className="justify-content-center align-items-center">
                <p className="text-center text-muted mb-4">
                  <RatingAvg rating={averageStars} />({averageStars.toFixed(2)}{" "}
                  — 총 {reviewPage.totalElements}건 평균)
                </p>
              </div>

              <div className="table-container">
                <Table bordered hover striped>
                  <thead>
                    <tr>
                      <th className="minDateWidth">주문 일시</th>
                      <th>작성 시점</th>
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
                          <td>{review.orderTimeStr}</td>
                          <td>{review.reviewDayDelay}일 후</td>
                          <td>{review.stars}</td>
                          <td
                            style={{ cursor: "pointer" }}
                            className="text-start linkLook text-primary"
                            onClick={() =>
                              viewReviewDetail(
                                review.id,
                                review.customerName,
                                review.reviewTime,
                              )
                            }
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <p className="text-center mb-0 mt-4"></p>
    </Container>
  );
};

export default ReviewTable;
