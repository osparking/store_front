import { useEffect, useState } from "react";
import {
  Button,
  Col,
  Form,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import { BsPlusSquareFill } from "react-icons/bs";
import { setDifference } from "../util/utilities.js";
import OrderItemEntry from "./OrderItemEntry.jsx";

const OrderForm = ({ shapeLabels, changeCarouselShape }) => {
  const [formData, setFormData] = useState({
    userId: 3,
    items: [
      {
        shape: "",
        count: "1",
      },
    ],
    recipRegiReq: {
      addressDetail: "1001동 1503호",
      doroZbun: "지번",
      addrBasisAddReq: {
        zipcode: "12915",
        roadAddress:
          "경기도 하남시 미사강변서로 127 (망월동, 미사강변센텀팰리스(CentumPalace)) 1801동~1817동",
        zBunAddress:
          "경기도 하남시 망월동 1050 (미사강변센텀팰리스(CentumPalace))",
      },
      mbPhone: "010-1111-2222",
      fullName: "홍길동",
    },
    orderStatus: "결재대기",
  });

  const [disableButton, setDisableButton] = useState(false);

  const findDefaultShape = (allLabels) => {
    console.log("Form data items changed:", formData.items);
    const listedLabels = new Set(formData.items.map((label) => label.shape));
    console.log("sel set:", listedLabels);
    const notListedLabels = setDifference(allLabels, listedLabels);

    setDisableButton(notListedLabels.length === 0);
    if (notListedLabels.length > 0) {
      setDefaultShape(notListedLabels[0]);
    }
  };

  useEffect(() => {
    setDisableButton(false);
  }, []);

  useEffect(() => {
    const allLabels = shapeLabels
      .filter((label) => label.count > 0)
      .map((label) => label.shapeLabel);

    findDefaultShape(allLabels);
  }, [shapeLabels, formData.items]);

  const [defaultShape, setDefaultShape] = useState();

  const handlePropChange = (index, e) => {
    const { name, value } = e.target;
    const newItems = [...formData.items];
    newItems[index][name] = value;
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const addSoapItem = () => {
    const newItem = {
      shape: defaultShape,
      count: "1",
    };
    setFormData((prevState) => ({
      ...prevState,
      items: [...prevState.items, newItem],
    }));
  };

  const delSoapItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData((prevState) => ({ ...prevState, items: newItems }));
  };

  return (
    <div className="order-form">
      <Form onSubmit={handleSubmit}>
        <fieldset className="field-set mb-4">
          <Form.Group className="mb-2">
            <Row className="justify-content-center mb-2">
              <Col md={2}></Col>
              <Col md={5}>
                <legend className="legend text-center">외형별 수량</legend>
              </Col>
              <Col md={2}>
                <OverlayTrigger overlay={<Tooltip>외형 추가</Tooltip>}>
                  <Button
                    className="btn btn-sm btn-primary me-1"
                    onClick={addSoapItem}
                    disabled={false || disableButton}
                  >
                    <BsPlusSquareFill />
                  </Button>
                </OverlayTrigger>
              </Col>
            </Row>
            {formData.items.map((item, index) => (
              <OrderItemEntry
                key={index}
                index={index}
                item={item}
                formDataItems={formData.items}
                shapeLabels={shapeLabels}
                handleInputChange={(e) => handlePropChange(index, e)}
                changeCarouselShape={changeCarouselShape}
                canRemove={index > 0}
                delSoapItem={delSoapItem}
              />
            ))}
          </Form.Group>
        </fieldset>
      </Form>
    </div>
  );
};

export default OrderForm;
