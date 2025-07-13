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

  const [showSodaWater, setShowSodaWater] = useState(false);
  const toggleSodaWater = () => {
    setShowSodaWater(!showSodaWater);
  };
  const [showHalfSolid, setShowHalfSolid] = useState(false);
  const toggleHalfSolid = () => {
    setShowHalfSolid(!showHalfSolid);
  };

  const [showCutSteps, setShowCutSteps] = useState(false);
  const toggleCutSteps = () => {
    setShowCutSteps(!showCutSteps);
  };

  const imageRoot = "/src/assets/images/ingred";

  return (
    <Container fluid className="home-container mt-5">
      <Row className="justify-content-center allIngred mt-3">
        <Col md={8}>
          <h2 className="ps-0 m-4">
            <strong>제조 절차</strong>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center allIngred ">
        <Col md={8}>
          <table className="stepInfo mt-3">
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
          <table className="stepInfo mt-3">
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
                    제조하는 절차이다. <br />
                    <span className="WARNING">주의</span>- 3~11 단계는 비누의
                    어성초 및 율무씨 분말 층에 대하여 각각 수행한다.
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
              <li>
                올리브유를 증탕 방식으로 가열하기 시작한다
                <ul>
                  <li>가열 목표: 45℃ - 약 10분 소요</li>
                </ul>
              </li>
              <li>
                다음 두 가지 재료를 계량한다.
                <ul>
                  <li>정제수 - 526g</li>
                  <li>
                    가성소다 - 588g
                    <br />
                    * 올리브유 대 가성소다: 0.133
                    <br />
                    <a href="#ingTable">근거 테이블</a>
                  </li>
                </ul>
              </li>
              <li>
                다음 절차로 가성소다수를 만든다.
                {showSodaWater ? (
                  <div>
                    <button
                      className="toggleButton sans"
                      onClick={toggleSodaWater}
                    >
                      [가성소다수 제조 절차 {showSodaWater ? "숨김" : ""}]
                    </button>
                    <ul>
                      <li>2L 비이커에 정제수 얼음물 제조 - 총량 1,326g</li>
                      <li>발생 가스의 실외 배출을 위해 선풍기 가동</li>
                      <li>
                        비이커에 가성소다를 조금씩 추가하며 스텐 거품기로 혼합
                        <br />
                        (가성소다 증기의{" "}
                        <span className="WARNING">독성은 구토를 유발</span>할 수
                        있으니 주의할 것)
                      </li>
                      <li>
                        가성소다수 온도가 45℃ 이상일 것이므로, 45℃ 로 식고,
                        투명해질 때까지 대기 - 약 10분 소요
                        <br />(
                        <span className="WARNING">가성소다수는 독극물</span>
                        이므로 취급에 주의할 것.)
                      </li>
                    </ul>
                  </div>
                ) : (
                  <br />
                )}
                <button className="toggleButton sans" onClick={toggleSodaWater}>
                  [가성소다수 제조 절차 {showSodaWater ? "숨김" : ""}]
                </button>
              </li>
              <li>
                올리브유와 가성소다수를 다음 방법으로 혼합한다.
                <ul>
                  <li>올리브유 스탠 다라이 위에 미세 거름망을 받친다.</li>
                  <li>
                    가성소다수에 잔존 가능한 유리 알칼리를 걸러내기 위하여,
                    거름망을 통하여 가성소다수를 아주 천천히 흘려 보낸다.
                  </li>
                </ul>
              </li>
              <li>
                혼합액을 다음 방법으로 반 고체화한다
                {showHalfSolid ? (
                  <div>
                    <button
                      className="toggleButton sans"
                      onClick={toggleHalfSolid}
                    >
                      [혼합액 반 고체화 절차 {showHalfSolid ? "숨김" : ""}]
                    </button>
                    <ul>
                      <li>
                        큰 실리콘 주걱으로 2,3 분 저어 약한 트레이스를 낸다.
                      </li>
                      <li>
                        핸드 믹서를 기포가 생기지 않게 사용하여 혼합액을 섞는다.
                      </li>
                      <li>
                        약 1 분간 믹서 사용 후, 혼합액 색이 뽀얘지면, 향오일을
                        추가한다.
                      </li>
                      <li>
                        핸드 믹서를 사용하여 혼합액 고체화 정도를 높이는 동안
                        1,2 분 간격으로 응고 정도를 검사한다.
                      </li>
                      <li>
                        주걱을 사용하여 다라이 혼합액 표면에 별표를 그린다. 그
                        별표가 5초 이상 유지되면 고체화 과정을 완료한다.
                      </li>
                    </ul>
                  </div>
                ) : (
                  <br />
                )}
                <button className="toggleButton sans" onClick={toggleHalfSolid}>
                  [혼합액 반 고체화 절차 {showHalfSolid ? "숨김" : ""}]
                </button>
              </li>
              <li>
                천연 분말을 비누 원액에 섞는다
                <ul>
                  <li>
                    혼합액을 조금(어성초 층 - 150g, 율무씨 층 - 130g)
                    작은(0.5L)스탠 비이커에 소분한다. <br />
                  </li>
                  <li>천연 분말을 작은 비이커에 넣고 잘 푼다.</li>
                  <li>비이커 내용물을 전체 혼합액에 넣고 완전히 섞는다.</li>
                </ul>
              </li>
              <li>
                반 고체 원액을 두 층으로 몰드에 담는다
                <ul>
                  <li>한 몰드의 한 층으로 원액 490g을 투입한다.</li>
                  <li>어성초 층 견고화를 위해 한 두 시간 기다린다.</li>
                  <li>
                    기다리는 동안 몰드 배가 볼록해지지 않게, 몰드 사이에
                    골판지를 넣는다.
                  </li>
                  <li>비이커 내용물을 전체 혼합액에 넣고 완전히 섞는다.</li>
                </ul>
              </li>
              <li>
                율무씨 층까지 채운 뒤, 몰드를 보온고에 보관한다
                <ul>
                  <li>보온고 온도는 20℃로 설정한다.</li>
                  <li>사용했던 수건 등의 천류를 세탁한다</li>
                  <li>충분한 분량(800g 이상)의 얼음 제조를 시작한다.</li>
                </ul>
              </li>
              <li>
                약 2일 후, 낱개 비누를 잘라낸다
                {showCutSteps ? (
                  <div>
                    <button
                      className="toggleButton sans"
                      onClick={toggleCutSteps}
                    >
                      [비누 낱개화 절차 {showCutSteps ? "숨김" : ""}]
                    </button>
                    <ul>
                      <li>
                        층 분리 현상 방지를 위해, 보온고에서 몰드를 하니씩
                        꺼내며 작업한다.(
                        <span className="WARNING">층 분리 현상</span>: 한
                        범이비누의 어성초와 율무 층이 떨어지는 현상)
                      </li>
                      <li>
                        비누 커터로 두께 3.48cm 인 비누를 두 개 잘라낸다.(목표
                        중량: 125g)
                      </li>
                      <li>
                        두 번째 비누의 무게가 122~128g 인지 확인하고 두께를
                        조절하여 자른다.
                      </li>
                    </ul>
                  </div>
                ) : (
                  <br />
                )}
                <button className="toggleButton sans" onClick={toggleCutSteps}>
                  [비누 낱개화 절차 {showCutSteps ? "숨김" : ""}]
                </button>
              </li>
              <li>
                낱개 비누를 건조대에 펼쳐놓고 5 주간 건조시킨다.
                <ul>
                  <li>건조된 비누를 1차 비닐 포장한다</li>
                  <li>건조 종료일을 제품 제조일로 부여한다</li>
                </ul>
              </li>
            </ol>
            <hr className="mt-3" />
            <p className="endItem mb-5">끝</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProduceSteps;
