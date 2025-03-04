import React from "react";
import { Col, Container, Row } from "react-bootstrap";

const Home = () => {
  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Img
              variant="top"
              src={olive_label}
              alt="엑스트라 버진 올리브 오일"
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
            </Card.Body>
          </Card>
        </Col>
        <Col> </Col>
      </Row>
    </Container>
  );
};

export default Home;
