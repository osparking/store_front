import { Col, Container, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import "../../index.css";
import { ingredients } from "./data.js";
import "./effect.css";

export default function Effect() {
  const imageRoot = "/src/assets/images/ingred";
  function ingredColor(ingredName) {
    let color = undefined;
    if (ingredName.indexOf("올리브") !== -1) {
      color = "DarkGoldenRod";
    } else if (ingredName.indexOf("어성초") !== -1) {
      color = "DarkGreen";
    } else if (ingredName.indexOf("율무") !== -1) {
      color = "#2c1e13";
    }
    return { color: color };
  }

  function Sujenara() {
    return (
      <Link to="https://sujaenara.com/" target="_blank">
        수제나라
      </Link>
    );
  }

  const listItems = ingredients.map((ingred, idx) => (
    <li key={idx}>
      <Container>
        <Row className="align-items-center">
          {" "}
          {/* Use align-items-center for vertical alignment */}
          <Col xs={12} md={6}>
            {" "}
            {/* Column for the image */}
            <Image
              src={`${imageRoot}/${ingred.imageFile}`}
              fluid
              alt={ingred.name}
            />
          </Col>
          <Col xs={12} md={6}>
            {" "}
            {/* Column for the paragraph */}
            <p className="inline">
              <b>{ingred.name}:</b>
              <span style={ingredColor(ingred.name)}>
                {" " + ingred.effect}
              </span>
              <br />
              <small>
                출처 -{" "}
                {ingred.source === "수제나라" ? Sujenara() : ingred.source},
                검색키 - {ingred.searchKey}, 검색일 - {ingred.searchDate}
              </small>
            </p>
          </Col>
        </Row>
      </Container>
      <hr />
    </li>
  ));

return (
  <Container fluid className="home-container ">
    <Row className="justify-content-center allIngred">
      <Col md={8}>
        <div>
          <h2 className="mt-3 mb-1">
            <small>재료에서 유래하는...</small>
            <strong> 비누 효능</strong>
          </h2>
          <hr />
          <ul className="noBullet">{listItems}</ul>
        </div>
      </Col>
    </Row>
  </Container>
);
}
