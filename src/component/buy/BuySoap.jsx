import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import SoapCarousel from "../soaps/SoapCarousel.jsx";
import { soapImages } from "../soaps/SoapImages.js";
import { labelsOver } from "../util/utilities.js";
import OrderForm from "./OrderForm.jsx";
import { getSoapShapes } from "./orderService.js";

const BuySoap = () => {
  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const sWhiteSoaps = soapImages.filter((soap) => soap.shape === "s-white");
  const maejooSoaps = soapImages.filter((soap) => soap.shape === "maejoo");

  const [images2show, setImages2show] = useState(normalSoaps);
  const [shapeLabels, setShapeLabels] = useState([]);

  function changeCarouselShape(idx) {
    const prefix = shapeLabels[idx].shapeLabel.substring(0, 2);
    setCarouselImages(prefix);
  }

  function setCarouselImages(prefix) {
    switch (prefix) {
      case "보통":
        setImages2show(normalSoaps);
        break;
      case "백설":
        setImages2show(sWhiteSoaps);
        break;
      case "메주":
        setImages2show(maejooSoaps);
        break;
      default:
        setImages2show(normalSoaps);
        break;
    }
  }

  useEffect(() => {
    const readShapes = async () => {
      try {
        const response = await getSoapShapes();
        setShapeLabels(response.data);
        calculateDefaultLabel(response.data);
      } catch (error) {
        console.error("Error fetching soap shapes:", error);
      }
    };
    readShapes();
  }, []);

  const [optionLabels, setOptionLabels] = useState([]);
  const [defaultLabel, setDefaultLabel] = useState("");

  const calculateDefaultLabel = (labels) => {
    const optionLabels = labels.map((shape) => ({
      optionLabel:
        shape.count > 0
          ? `${shape.shapeLabel}(재고: ${shape.count})`
          : `${shape.shapeLabel}(품절)`,
      inventory: shape.count,
      price: shape.price,
    }));
    setOptionLabels(optionLabels);

    const plus20soaps = labelsOver(optionLabels, 19);
    if (plus20soaps.length > 0) {
      setDefaultLabel(plus20soaps[0]);
      setCarouselImages(plus20soaps[0].substring(0, 2));
    } else {
      setDefaultLabel("");
    }
  };

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
                optionLabels={optionLabels}
                defaultLabel={defaultLabel}
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
