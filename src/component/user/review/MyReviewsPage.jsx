import { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { fetchReview, getReviewPage, patchOrderReview } from "../../buy/orderService";
import Paginator from "../../common/Paginator";
import "../../pay_toss/MyOrdersPage.css";
import { formatDate } from "../../util/utilities";
import ReviewModal from "../../modal/ReviewModal";

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

  const manageReview = async (oId) => {
    const review = await fetchReview(oId);
    setReview({...review, id: oId});
    setShowReviewModal(true);
  };

  const saveReview = async (reviewData) => {
    setShowReviewModal(false);
    await patchOrderReview(reviewData);
    loadReviewPage();
  };

  return (
    <div className="box_section orders_table_div">
      <ReviewModal
        show={showReviewModal}
        handleClose={() => setShowReviewModal(false)}
        title={"후기 관리"}
        order={review}
        saveReview={saveReview}
      />
      <div className="d-flex justify-content-center align-items-center">
        <h3>나의 후기 목록</h3>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <p className="text-center text-muted mb-4">
          후기 총 {reviewPage.totalElements} 건 중, {indexOfFirst + 1} ~{" "}
          {Math.min(idxLastPlus1, reviewPage.totalElements)}번째 후기
        </p>
      </div>
      <div
        id="orderTable"
        style={{ whiteSpace: "initial" }}
        className="d-flex justify-content-center align-items-center"
      >
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>주문명</th>
              <th>주문일시</th>
              <th>후기 시작 부분</th>
              <th>후기 길이</th>
              <th>후기 작성일시</th>
              <th>주문ID</th>
            </tr>
          </thead>
          <tbody>
            {reviews &&
              reviews.map((review, idx) => (
                <tr key={idx}>
                  <td>{review.orderName}</td>
                  <td>{formatDate(review.orderTime)}</td>
                  <td className="text-start">
                    <a href="#" onClick={() => manageReview(review.id)}>
                      {review.reviewPreview}
                    </a>
                  </td>
                  <td>{review.reviewLength}</td>
                  <td>{formatDate(review.reviewTime)}</td>
                  <td className="text-center">{review.id}</td>
                </tr>
              ))}
          </tbody>
        </Table>
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
      <div className="d-flex justify-content-center align-items-center">
        <Button
          variant="info"
          onClick={() => goHome()}
          style={{ marginTop: "30px" }}
        >
          범이비누
        </Button>
      </div>
    </div>
  );
};

export default MyReviewsPage;
