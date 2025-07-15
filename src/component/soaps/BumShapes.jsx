import { Col, Container, Row } from "react-bootstrap";

const BumShapes = () => {
  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8}>
          <h2 className="ps-0 m-4">
            <strong>비누 외형 3 종</strong>
          </h2>
          <h5>범이비누의 세가지 외형은 다음 두 요소에 의하여 빚어집니다.</h5>
          <ul>
            <li>
              <strong>향오일 상표</strong> - 범이가 사용한 제주 비자나무
              향오일은 기본형과 변경형이 있습니다. 기본형은{" "}
              <a href="https://degrasse.kr/index.html">드그라쎄</a>에서 '20년
              12월 말부터 리터당 6.4만원에 구매하였고, 변경형은 네이버 스토어인{" "}
              <a href="https://smartstore.naver.com/herbrapa">허브라파</a>(현재
              운영 중지 상태) 에서 '21년 1월 8일 리터당 7.8만원에 구매한
              것입니다.
            </li>
            <li>
              <strong>소다회 발생</strong> - 범이비누가 5 주간 숙성되는 동안
              비누 표면에 (원치 않게)백색 소다회가 생성될 수 있습니다.
              범이비누는 '20년 12월 말부터 약 두달 간 제조되었고, 따라서, 비누
              건조 기간 동안 주위 온도가 낮아서 소다회가 생겼다고 추정하고
              있습니다.
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default BumShapes;
