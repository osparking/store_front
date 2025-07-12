import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import "../../index.css";
import "./produceSteps.css";

const ProduceSteps = () => {
  const [showDeviceList, setShowDeviceList] = useState(false);
  const toggleDeviceList = () => {
    setShowDeviceList(!showDeviceList);
  };
  const [showFourIngred, setShowFourIngred] = useState(false);
  const toggleFourIngred = () => {
    setShowFourIngred(!showFourIngred);
  };

  const imageRoot = "/src/assets/images/ingred";

  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8}>
          <table className="stepInfo mt-5">
            <thead>
              <tr>
                <td className="WARNING h4">경고</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="ms-2 me-2">
                    작업자는 비누 생산 절차 중{" "}
                    <span className="WARNING">가성소다수</span>
                    (별칭 <span className="WARNING">양잿물</span>)를 만들어
                    사용하므로, 작업 중 심한 화상 등 부작용 방지를 위하여,
                    지정된 장비를 착용하고, 작업 지침을 준수해야 된다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row className="justify-content-center allIngred">
        <Col md={8}>
          <table className="stepInfo mt-5">
            <thead>
              <tr>
                <td className="INFO h4">적용 범위</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="INFO">
                  <div className="ms-2 me-2">
                    여기서 설명하는 것은 범이비누 104 개를 48 시간 주기로
                    제조하는 절차이다. <span className="WARNING">주의,</span> 3
                    ~ 11 단계는 비누의 어성초 및 율무씨 분말 층에 대하여 각각
                    수행한다.
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row className="justify-content-center allIngred pt-3 mb-5">
        <Col md={8}>
          <div>
            <h2 className="ps-0 m-4">제조 절차</h2>
            <ol>
              <li>
                작업자는 다음 의복류를 착용한다.
                <ul>
                  <li>피부 노출을 막는 상ᐧ하의</li>
                  <li>작업용 내화학(비닐류) 앞치마</li>
                  <li>상의 소매 보호용 양팔용 토시</li>
                  <li>안면 보호 마스크</li>
                  <li>내화학 장갑</li>
                </ul>
              </li>
              <li>
                다음 비누 제조 도구를 확인한다.
                {showDeviceList ? (
                  <div id="deviceList">
                    <button
                      className="toggleButton sans"
                      onClick={toggleDeviceList}
                    >
                      [비누 제조 도구 목록 {showDeviceList ? "숨김" : ""}]
                    </button>
                    <ul>
                      <li>핸드 믹서 - 회전부 분리 가능</li>
                      <li>몰드 13 개 - 규격 1kg</li>
                      <li>비누 커터기</li>
                      <li>마른 수건 2 개</li>
                      <li>
                        온도계 2 개
                        <ul>
                          <li>알람 탐침 디지털 온도계 - 온수용</li>
                          <li>비접촉 디지털 온도계 - 가성소다수용</li>
                        </ul>
                      </li>
                      <li>저울 2 개 - 10kg, 1kg</li>
                      <li>실리콘 주걱 3 개 - 대 1, 소 2</li>
                      <li>플라스틱 컵 5 개 - 어성초, 율무, 향오일 계량용</li>
                      <li>
                        용기
                        <ul>
                          <li>플라스틱 통 - 1L, 2L(2 개), 5L(2 개)</li>
                          <li>스텐 비이커 - 0.5L(2 개), 5L</li>
                          <li>스텐 다라이 - 5L, 10L, 30L</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                ) : (
                  <br />
                )}
                <button
                  className="toggleButton sans"
                  onClick={toggleDeviceList}
                >
                  [비누 제조 도구 목록 {showDeviceList ? "숨김" : ""}]
                </button>
              </li>
              <li id="ingTable">
                올리브유 증탕용 물을 가열하기 시작한다
                <ul>
                  <li>30L 스탠 다라이, 물 15kg, 알람 온도계 사용</li>
                </ul>
              </li>
              <li>
                다음 네 가지 재료를 계량한다.
                <ul>
                  <li className="noBullet stress">
                    ※근거 테이블: <br />
                    <img
                      className="ms-3 mt-2 mb-3 ingredTabImg"
                      src={`${imageRoot}/soap-6-ingred.png`}
                      alt="재료 중량 표"
                    />
                  </li>
                </ul>
                {showFourIngred && (
                  <div>
                    <button
                      className="toggleButton sans"
                      onClick={toggleFourIngred}
                    >
                      [네 가지 재료 목록 {showFourIngred ? "숨김" : ""}]
                    </button>
                    <ul>
                      <li>올리브 오일 - 4,420g (10L 스탠 다라이)</li>
                      <li>어성초 분말 - 59g</li>
                      <li>율무씨 분말 - 59g</li>
                      <li>비자나무 향오일 - 177g</li>
                    </ul>
                  </div>
                )}
                <button
                  className="toggleButton sans"
                  onClick={toggleFourIngred}
                >
                  [네 가지 재료 목록 {showFourIngred ? "숨김" : ""}]
                </button>
              </li>              
            </ol>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProduceSteps;
