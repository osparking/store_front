import React from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import olive_label from "../../assets/images/olive_label.jpg";

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
              <Button variant="outline-info">범이비누를 만나보세요</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col> </Col>
      </Row>
    </Container>
  );
};

export default Home;
