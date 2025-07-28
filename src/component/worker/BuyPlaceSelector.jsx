import React, { useEffect, useState } from "react";
import { Form, Row } from "react-bootstrap";
import AdderModal from "../modal/AdderModal";
import { getAllBuyLinks } from "./WorkerService";

const BuyPlaceSelector = ({ buyPlace, onChange }) => {
  const [buyLinks, setBuyLinks] = useState([]);
  const [showLinkAdder, setShowLinkAdder] = useState(false);

  useEffect(() => {
    const readBuyLinks = async () => {
      try {
        const response = await getAllBuyLinks();
        setBuyLinks(response.data);
        console.log("구매 링크 목록: ", response.data);
      } catch (error) {
        console.error(error.response.data.message);
      }
    };
    readBuyLinks();
  }, []);

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

  return (
    <React.Fragment>
      <Form.Group as={Row} controlId="buyLink" className="mb-4">
        <Form.Label>구매 링크</Form.Label>
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
          <option value="add_link">(구매 링크 추가)</option>
        </Form.Control>
      </Form.Group>
      <AdderModal
        show={showLinkAdder}
        closer={() => {
          setShowLinkAdder(false);
        }}
        label={"구매 링크"}
        saver={handleNewLink}
      />
    </React.Fragment>
  );
};

export default BuyPlaceSelector;
