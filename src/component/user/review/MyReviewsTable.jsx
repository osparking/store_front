import { Table } from "react-bootstrap";
import { formatDate } from "../../util/utilities";

const MyReviewsTable = (reviews, manageReview) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr className="userTableHeader">
          <th>주문명</th>
          <th className="minDateWidth">주문일시</th>
          <th>별점</th>
          <th>후기 시작 부분</th>
          <th className="minDateWidth">후기 작성일시</th>
          <th>주문ID</th>
        </tr>
      </thead>
      <tbody>
        {reviews &&
          reviews.map((review, idx) => (
            <tr key={idx}>
              <td>{review.orderName}</td>
              <td>{formatDate(review.orderTime)}</td>
              <td>{review.stars}</td>
              <td className="text-start">
                <a href="#" onClick={() => manageReview(review)}>
                  {review.reviewPreview}
                </a>
              </td>
              <td>{formatDate(review.reviewTime)}</td>
              <td className="text-center">{review.id}</td>
            </tr>
          ))}
      </tbody>
    </Table>
  );
};

export default MyReviewsTable;
