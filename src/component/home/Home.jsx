import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import olive_label from "../../assets/images/olive_label.jpg";
import soap_rack from "../../assets/images/soap_rack.jpg";

const Home = () => {
  return (
    <Container fluid className="home-container mt-3">
      <Row>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={olive_label}
              alt="엑스트라 버진 올리브 오일"
              className="hero-image"
            />
            <Card.Body>
              <Card.Title>소중한 피부의 친구~</Card.Title>
              <Card.Text>
                제가 어떤 수제비누를 관광지 해변 휴게실 근처 좌판대에서 만난
                것은 2019년 봄이었을 겁니다. 평소 피부 가려움증으로 매해 가을의
                시작과 함께 저는 이른바 피부 트러블로 이듬해 우수 경칩이 될
                때까지 피부에 거의 온 신경을 쓰면서 지내야 했기 때문에
                수제비누가 제게 안겨준 평온함은 정말 돈으로 가치를 따지기 어려울
                정도였습니다.
              </Card.Text>
              <Card.Text>
                아무리 그래도 100 그램 비누 한장이 사천원에서 하루 아침에
                6천원이 되고 또 8천원이 되자 저는 직접 만들어서 사용해 보자고
                생각했습니다. 유튜브를 검색하던 중 저는 어떤 여성 유튜버의
                올리브오일 엑스트라 버진 수제비누 제조 영상을 보게 되었습니다.
                저는 여러가지 도구와 재료를 인터넷 몰에서 구입하여 일단 비누
                열장을 만들어 사용해 보았고, 그 효과는 '19년 봄에 만났던 그
                수제비누와 마찬가지로 제 허벅지 피부 가려움증을 거의 해소시켜
                주었습니다.
              </Card.Text>
              <Button variant="outline-info">범이비누로 들어오세요</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Img
              variant="top"
              src={soap_rack}
              alt="범이비누 정보"
              className="hero-image"
            />
            <h6 className="text-center mb-3 bumsoap-color">
              숙성 중인 범이비누
            </h6>
            <Card.Body>
              <Card.Title>관련 정보 목록</Card.Title>
              <ListGroup className="services-list">
                <ListGroup.Item>비누 재료</ListGroup.Item>
                <ListGroup.Item>비누 제조 절차</ListGroup.Item>
                <ListGroup.Item>비누 영상</ListGroup.Item>
                <ListGroup.Item>질의 및 응답</ListGroup.Item>
                <ListGroup.Item>고객님 의견</ListGroup.Item>
              </ListGroup>
              <Card.Text className="mt-3">
                고객님들의 성원과 참여도에 따라 재료 대량 구매, 생산 작업의 부분
                자동화 등을 통하여 비누 가격이 내려갈 수 있으며, 에센셜 향오일을
                사용하는 등의 품질 고급화 및 다양화가 가능할 수 있습니다.
              </Card.Text>
              <Button variant="outline-info">범이비누 종류 보기</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <p className="text-center">
                여기를 범이비누를 직접 구매ᐧ사용한 고객님들의 목소리가 있습니다.
              </p>
              <h5 className="text-center">
                <span className="text-info"> 고객님 리뷰</span>
              </h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
