import { Fragment } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import Image from "react-bootstrap/Image";
import { Link } from "react-router-dom";
import "../../index.css";
import { ingredients } from "./data.js";
import "./effect.css";

export default function Effect() {
  const imageRoot = "/ingred";
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
    <Fragment key={idx}>
      <li>
        <div style={{ width: "100%" }}>
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
                className="mx-auto d-block"
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
        </div>
      </li>
      <hr />
    </Fragment>
  ));

  return (
    <Row
      className="justify-content-center mt-2 mb-2"
      style={{ height: "80vh" }}
    >
      <Col md={8}>
        <Card style={{ minWidth: "620px" }}>
          <Card.Body>
            <h2 className="mb-1">
              <strong> 비누 효능</strong>
              <br />
              <span style={{ fontSize: "0.6em" }}>(재료 유래 효능)</span>
            </h2>
            <hr />
            <ul className="noBullet">{listItems}</ul>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
