import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import SoapCarousel from "../soaps/SoapCarousel.jsx";
import { soapImages } from "../soaps/SoapImages.js";
import OrderForm from "./OrderForm.jsx";
import { getSoapShapes } from "./orderService.js";

const BuySoap = () => {
  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const sWhiteSoaps = soapImages.filter((soap) => soap.shape === "s-white");
  const maejooSoaps = soapImages.filter((soap) => soap.shape === "maejoo");

  const [images2show, setImages2show] = useState(normalSoaps);
  const [shapeLabels, setShapeLabels] = useState([]);
  const [defaultShape, setDefaultShape] = useState("보통비누");

  function changeCarouselShape(idx) {
    const prefix = shapeLabels[idx].shapeLabel.substring(0, 2);

    switch (prefix) {
      case "보통":
        setImages2show(normalSoaps);
        break;
      case "백설":
        setImages2show(sWhiteSoaps);
        console.log("백설 비누로 변경");
        break;
      case "메주":
        setImages2show(maejooSoaps);
        break;
      default:
        console.error("Unknown shape prefix:", prefix);
        setImages2show(normalSoaps);
    }
  }

  useEffect(() => {
    const readShapes = async () => {
      try {
        const response = await getSoapShapes();
        setShapeLabels(response.data.shapeLabelList);
        console.log("list: " + JSON.stringify(response.data.shapeLabelList));
        setDefaultShape(response.data.defaultShape);
      } catch (error) {
        console.error("비누 외형 읽기 오류:", error);
      }
    };
    readShapes();
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <Row className="justify-content-center">
        {" "}
        {/* Use align-items-center for vertical alignment */}
        <Col xs={10} md={5}>
          <Card className="shadow mb-5">
            <Card.Header as="h5" className="text-center"></Card.Header>
            <Card.Body>
              <SoapCarousel
                soapImages={images2show}
                bgColor="#263e59"
                indColor="#6199daff"
                id="carousel"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={10} md={5}>
          <Card className="shadow mb-5">
            <Card.Header as="h5" className="text-center">
              비누 주문 내역
            </Card.Header>
            <Card.Body>
              <OrderForm
                shapeLabels={shapeLabels}
                defaultShape={defaultShape}
                changeCarouselShape={changeCarouselShape}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BuySoap;
