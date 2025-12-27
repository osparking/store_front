import { useRef, useState } from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import "./bumShapes.css";
import { bgColor, indColor, soapImages } from "./soapImages.js";
import SoapImages from "./SoapImages.jsx";

const BumShapes = () => {
  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const sWhiteSoaps = soapImages.filter((soap) => soap.shape === "s-white");
  const maejooSoaps = soapImages.filter((soap) => soap.shape === "maejoo");
  const manageSoaps = soapImages.filter((soap) => soap.shape === "manage");

  const handleSoapShapeSelect = (key) => {
    setCurrTabKey(key);
    localStorage.setItem("SOAP_SHAPE_TAB", key);
  };

  const [currTabKey, setCurrTabKey] = useState(
    localStorage.getItem("SOAP_SHAPE_TAB") || "normalSoap"
  );

  const imageRowRef = useRef(null);
  const shapeClicked = (shape) => {
    imageRowRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    handleSoapShapeSelect(shape);
  };

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
      <Row className="justify-content-center allIngred ">
        <Col md={8}>
          <table className="stepInfo mt-3">
            <caption>
              <ul className="billiard ms-3">
                <li className="mt-0">
                  <strong>
                    <small>
                      변경형 향오일 비누에 소다회가 끼는 현상은 거의 없었습니다.
                      이는 변경 향오일이 숙성 중의 비누 온도를 다소 높여주는
                      것이 원인일 거라고 추정합니다.
                    </small>
                  </strong>
                </li>
              </ul>
            </caption>
            <thead>
              <tr>
                <th className="">구분</th>
                <th className="">비자나무 향오일</th>
                <th className="">소다회 생성 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>
                    <button onClick={() => shapeClicked("normalSoap")}>
                      보통비누
                    </button>
                  </strong>
                </td>
                <td>기본형</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong>
                    <button onClick={() => shapeClicked("sWhiteSoap")}>
                      백설공주
                    </button>
                  </strong>
                </td>
                <td>기본형</td>
                <td>생성</td>
              </tr>
              <tr>
                <td>
                  <strong>
                    <button onClick={() => shapeClicked("maejooSoap")}>
                      메주비누
                    </button>
                  </strong>
                </td>
                <td>변경형</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row className="justify-content-center allIngred mb-5">
        <Tabs
          ref={imageRowRef}
          defaultActiveKey={currTabKey}
          activeKey={currTabKey}
          className="tabBackground tabHead tabFix contentHolyCentered"
          onSelect={handleSoapShapeSelect}
          style={{ position: "sticky", top: "115px", zIndex: 2 }}
        >
          <Tab
            eventKey="normalSoap"
            className="carousel-container"
            title={<h5>보통비누</h5>}
            style={{ backgroundColor: "lightBlue" }}
          >
            <SoapImages
              soapImages={normalSoaps}
              bgColor={bgColor.normal}
              indColor={indColor.normal}
              heading="보통비누"
            />
          </Tab>
          <Tab eventKey="sWhiteSoap" title={<h5>백설공주</h5>}>
            <SoapImages
              soapImages={sWhiteSoaps}
              bgColor={bgColor.sWhite}
              indColor={indColor.sWhite}
              heading="백설공주"
            />
          </Tab>
          <Tab eventKey="maejooSoap" title={<h5>메주비누</h5>}>
            <SoapImages
              soapImages={maejooSoaps}
              bgColor={bgColor.maejoo}
              indColor="#a9b2bfff"
              heading="메주비누"
            />
          </Tab>
          <Tab eventKey="manage" title={<h5>사용방법</h5>}>
            <SoapImages
              soapImages={manageSoaps}
              bgColor="#4e5c80"
              indColor="#99a4c0ff"
              heading="사용 방법"
            />
          </Tab>
        </Tabs>
      </Row>
    </Container>
  );
};

export default BumShapes;
