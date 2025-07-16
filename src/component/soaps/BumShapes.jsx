import { useState } from "react";
import { Col, Container, Figure, Row } from "react-bootstrap";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./bumShapes.css";
import { soapImages } from "./soapImages.js";

const BumShapes = () => {
  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const selColor = "#d9c1a6";
  const [slide, setSlide] = useState(0);
  const imageRoot = "/src/assets/images/soap";
  const arrowSz = 1.8; // in rem

  const arrowStyle = {
    position: "absolute",
    color: selColor,
    width: `${arrowSz}rem`,
    height: `${arrowSz}rem`,
    marginTop: `${-(arrowSz / 2)}rem`,
    zIndex: "1",
    top: "50%",
  };

  const buttonStyle = {};

  const [arrowDisabled, setArrowDisabled] = useState(false);

  const nextSlide = (lOrR) => {
    if (arrowDisabled) {
      return;
    }
    let newSlide = -1;
    if (lOrR === "R") {
      newSlide = (slide + 1) % normalSoaps.length;
    } else {
      newSlide = (slide - 1 + normalSoaps.length) % normalSoaps.length;
    }
    setSlide(newSlide);
    setArrowDisabled(true); // Disable the arrow
    setTimeout(() => {
      setArrowDisabled(false);
    }, 200);
  };

  const imgWidth = 500;

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
                    <a href="#normal-soap">보통비누</a>
                  </strong>
                </td>
                <td>기본형</td>
                <td></td>
              </tr>
              <tr>
                <td>
                  <strong>백설공주</strong>
                </td>
                <td>기본형</td>
                <td>생성</td>
              </tr>
              <tr>
                <td>
                  <strong>메주비누</strong>
                </td>
                <td>변경형</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
      <Row className="justify-content-center allIngred pt-3 mb-5">
        <Col md={8}>
          <h2 className="ps-0 mb-4" id="normal-soap">
            <strong>보통비누</strong>
          </h2>
          <div className="carousel-container">
            <div className="carousel">
              <button
                className="arrow arrow-left"
                style={buttonStyle}
                onClick={() => nextSlide("L")}
                disabled={arrowDisabled}
              >
                <BsArrowLeftCircleFill style={arrowStyle} />
              </button>
              {normalSoaps.map((soap, idx) => {
                return (
                  <img
                    key={idx}
                    style={{ backgroundColor: "#263e59", width: imgWidth }}
                    src={`${imageRoot}/${soap.image}`}
                    alt={soap.name}
                    className={
                      slide === idx
                        ? "slide carousel"
                        : "slide carousel slide-hidden"
                    }
                  />
                );
              })}
              <button
                className="arrow arrow-right"
                style={buttonStyle}
                onClick={() => nextSlide("R")}
                disabled={arrowDisabled}
              >
                <BsArrowRightCircleFill style={arrowStyle} />
              </button>
              <span className="indicators">
                {normalSoaps.map((_, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => setSlide(idx)}
                      className={
                        slide === idx
                          ? "indicator"
                          : "indicator indicator-inactive"
                      }
                      style={{
                        backgroundColor: slide === idx ? selColor : "#6199daff",
                      }}
                    />
                  );
                })}
              </span>
            </div>
          </div>
          <div className="imgCapDiv">
            <Figure className="mt-3">
              <Figure.Caption style={{ width: imgWidth }} className="soapCap">
                <strong>{normalSoaps[slide].desc}</strong>
              </Figure.Caption>
            </Figure>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BumShapes;
