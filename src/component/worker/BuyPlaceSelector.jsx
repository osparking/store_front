import React, { useEffect, useState } from "react";
import { Form, Row, Button } from "react-bootstrap";
import AdderModal from "../modal/AdderModal";
import { getBuyLinksFor } from "./WorkerService";

const BuyPlaceSelector = ({ buyPlace, onChange, ingreName }) => {
  const [buyLinks, setBuyLinks] = useState([]);
  const [showLinkAdder, setShowLinkAdder] = useState(false);

  useEffect(() => {
    const readBuyLinks = async () => {
      try {
        const response = await getBuyLinksFor(ingreName);
        setBuyLinks(response.data);
      } catch (error) {
        console.error(
          "구매처 URL 적재 오류: ",
          error.response ? error.response.data : error.message,
        );
      }
    };
    readBuyLinks();
  }, [ingreName]);

  const handleBuyPlace = (event) => {
    if (event.target.value === "add_link") {
      setShowLinkAdder(true);
    } else {
      onChange(event);
    }
  };

  const handleNewLink = (newLink) => {
    console.log("새 link: " + newLink);
    if (newLink && !buyLinks.includes(newLink)) {
      setBuyLinks([...buyLinks, newLink]);
      onChange({ target: { name: "buyPlace", value: newLink } });
    }
  };

  const checkBuyPlace = () => {
    if (buyPlace || buyPlace !== "") {
      window.open(buyPlace, "_blank", "noreferrer");
    }
  };

  return (
    <React.Fragment>
      <Form.Group as={Row} controlId="buyLink" className="mb-4">
        <Form.Label>
          구매 링크
          <Button
            variant="success"
            disabled={!buyPlace || buyPlace === ""}
            size="sm"
            className="ml-2 ms-3 py-0 mb-1"
            onClick={checkBuyPlace}
          >
            링크 검사
          </Button>
        </Form.Label>
        <Form.Control
          as="select"
          name="buyPlace"
          value={buyPlace}
          required
          onChange={handleBuyPlace}
        >
          <option value="">- 구매 링크 -</option>
          {buyLinks.map((name, index) => (
            <option value={name} key={index}>
              {name}
            </option>
          ))}
          <option value="add_link">(구매 링크 혹은 구매처 이름 추가)</option>
        </Form.Control>
      </Form.Group>
      <AdderModal
        show={showLinkAdder}
        closer={() => {
          setShowLinkAdder(false);
        }}
        label={"구매 링크 혹은 구매처 이름"}
        saver={handleNewLink}
        dialogClass={"link-adder-modal"}
      />
    </React.Fragment>
  );
};

export default BuyPlaceSelector;
