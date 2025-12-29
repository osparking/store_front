import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const RatingAvg = ({ rating }) => {
  const starsMax = 5;
  let stars = [];

  // (찬)별 rating 정수부 만큼 삽입
  for (let i = 0; i < Math.floor(rating); i++) {
    stars.push(<FaStar key={i} color="#ffc107" />);
  }

  // 반 별 조건부 삽입 - 소수점 이하 값이 0.25 이상일 때
  if (rating % 1 >= 0.25) {
    stars.push(<FaStarHalfAlt key="half" color="#ffc107" />);
  }

  // stars 길이 5 되게, 빈 별 삽입
  for (let i = stars.length; i < starsMax; i++) {
    stars.push(<FaRegStar key={i} color="#e4e5e9" />);
  }

  return <span className="me-2 ms-2">{stars}</span>;
};

export default RatingAvg;
