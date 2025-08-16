import { Col, Row } from "react-bootstrap";
import { soapImages } from "../soaps/SoapImages.js";
import SoapCarousel from "../soaps/SoapCarousel.jsx";

const BuySoap = () => {
  const normalSoaps = soapImages.filter((soap) => soap.shape === "normal");
  const sWhiteSoaps = soapImages.filter((soap) => soap.shape === "s-white");
  const maejooSoaps = soapImages.filter((soap) => soap.shape === "maejoo");

  return (
    <div style={{ width: "100%" }}>
      <Row className="align-items-center">
        {" "}
        {/* Use align-items-center for vertical alignment */}
        <Col xs={12} md={6}>
          <SoapCarousel
            soapImages={normalSoaps}
            bgColor="#263e59"
            indColor="#6199daff"
          />
        </Col>
        <Col xs={12} md={6}>
          {" "}
          {/* Column for the paragraph */}
          <p className="inline">외형</p>
        </Col>
      </Row>
    </div>
  );
};

export default BuySoap;
