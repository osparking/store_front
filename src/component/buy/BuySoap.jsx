import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import SoapCarousel from "../soaps/SoapCarousel.jsx";
import { bgColor, indColor, soapImages } from "../soaps/soapImages.js";
import { labelsOver } from "../util/utilities.js";
import OrderForm from "./OrderForm.jsx";
import { getSoapShapes } from "./orderService.js";
import "./buySoap.css";
import { useLocation } from "react-router-dom";
import ShoppingCart from "./ShoppingCart.jsx";

const BuySoap = () => {
  const location = useLocation();
  const { recipient, showCart } = location.state || false;

  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const sWhiteSoaps = soapImages.filter((soap) => soap.shape === "s-white");
  const maejooSoaps = soapImages.filter((soap) => soap.shape === "maejoo");

  const [images2show, setImages2show] = useState(normalSoaps);
  const [imageBgColor, setImageBgColor] = useState(bgColor.normal);
  const [imageIndColor, setImageIndColor] = useState(indColor.normal);
  const [shapeLabels, setShapeLabels] = useState([]);

  function changeCarouselShape(idx) {
    if (shapeLabels[idx]) {
      const prefix = shapeLabels[idx].shapeLabel.substring(0, 2);
      setCarouselImages(prefix);
    }
  }

  function setCarouselImages(prefix) {
    switch (prefix) {
      case "보통":
        setImages2show(normalSoaps);
        setImageBgColor(bgColor.normal);
        setImageIndColor(indColor.normal);
        break;
      case "백설":
        setImages2show(sWhiteSoaps);
        setImageBgColor(bgColor.sWhite);
        setImageIndColor(indColor.sWhite);
        break;
      case "메주":
        setImages2show(maejooSoaps);
        setImageBgColor(bgColor.maejoo);
        setImageIndColor(indColor.maejoo);
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

  const [slide, setSlide] = useState(0);

  return (
    <div style={{ width: "100%" }}>
      <div className="d-flex flex-wrap justify-content-center gap-3">
        <div className="col-md-5 order-card-width">
          <Card className="shadow mb-5">
            <Card.Body>
              <SoapCarousel
                soapImages={images2show}
                bgColor={imageBgColor}
                indColor={imageIndColor}
                slide={slide}
                setSlide={setSlide}
              />
            </Card.Body>
          </Card>
        </div>
        <div className="col-md-5 order-card-width">
          {showCart ? (
            <Card className="shadow mb-5">
              <Card.Header as="h5" className="text-center form-header">
                장바구니
              </Card.Header>
              <Card.Body>
                <ShoppingCart
                  optionLabels={optionLabels}
                  setCarouselImages={setCarouselImages}
                />
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow mb-5">
              <Card.Header as="h5" className="text-center form-header">
                비누 주문
              </Card.Header>
              <Card.Body>
                <OrderForm
                  optionLabels={optionLabels}
                  defaultLabel={defaultLabel}
                  changeCarouselShape={changeCarouselShape}
                  setCarouselImages={setCarouselImages}
                  recipient={recipient}
                />
              </Card.Body>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BuySoap;
