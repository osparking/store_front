import { Col, Container, Row } from "react-bootstrap";
import "../../index.css";
import { ingredients } from "./data.js";
import "./effect.css";
import { Link } from "react-router-dom";

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
    return {"color" : color};
  }

  function Sujenara() {
    return (
      <Link to="https://sujaenara.com/" target="_blank">수제나라</Link>      
    )
  }

  const listItems = ingredients.map((ingred) => (
    <li key={ingred.id}>
      <img src={`${imageRoot}/${ingred.imageFile}`} alt={ingred.name} />
      <p>
        <b>{ingred.name}:</b>
        <span style={ingredColor(ingred.name)}>{" " + ingred.effect}</span>
        <hr />
        <small>
          출처 - {ingred.source === "수제나라" ? Sujenara(): ingred.source}, 
          검색키 -{" "}
          {ingred.searchKey}, 검색일 - {ingred.searchDate}
        </small>
      </p>
      <hr />
    </li>
  ));

  return (
    <Container fluid className="home-container mt-3">
      <Row className="justify-content-center allIngred">
        <Col md={8}>
          <div>
            <h2>
              <small>재료에서 유래하는... </small>
              <br />
              <strong>비누 효능</strong>
            </h2>
            <ul className="noBullet">{listItems}</ul>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
