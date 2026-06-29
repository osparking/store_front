import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  OverlayTrigger,
  Table,
  Tooltip,
} from "react-bootstrap";
import { getFeeEtc } from "../../buy/orderService";

const DeliveryFeeCard = () => {
  const [feeEtc, setFeeEtc] = useState([]);
  const [originFeeEtc, setOriginPrices] = useState([]);

  useEffect(() => {
    console.log("배송비 관련 비용을 읽음");
    const readFeeEtc = async () => {
      const feeEtc = await getFeeEtc();

      setOriginPrices(feeEtc.data);
      setFeeEtc(feeEtc.data);
    };
    readFeeEtc();
  }, []);

  const deliveryData = [
    {
      label: "기본 배송비",
      name: "deliBasis",
      value: feeEtc.deliBasis,
    },
    {
      label: "제주 할증료",
      name: "deliJeju",
      value: feeEtc.deliJeju,
    },
    {
      label: "도서 할증료",
      name: "deliIsol",
      value: feeEtc.deliIsol,
    },
    {
      label: "무배 최저액",
      name: "deliFreeMin",
      value: feeEtc.deliFreeMin,
    },
  ];

  const handleSubmit = () => {};

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
      <Card id="soapPriceCard">
        <Card.Header className="text-center mb-2 h5">
          배송비 관련 설정
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="soapPrice" className="my-0">
              <tbody>
                {deliveryData.map((feeItem, index) => (
                  <tr key={index}>
                    <td
                      md={6}
                      className="text-end"
                      style={{ minWidth: "100px" }}
                    >
                      <Form.Label htmlFor={feeItem.name}>
                        {feeItem.label}
                        {" :"}
                      </Form.Label>
                    </td>
                    <td md={3} style={{ minWidth: "60px", paddingRight: "0" }}>
                      <Form.Control
                        type="text"
                        placeholder="0.00"
                        // disabled={soapPrice.disabled}
                        id={feeItem.name}
                        name={feeItem.name}
                        maxLength={6}
                        // onChange={(e) => handleChange(e, index)}
                        value={`${(feeItem.value ?? 0).toLocaleString()}`}
                        style={{
                          width: "60px", // 6자리(예: 999,999) + '원'에 적합
                          textAlign: "right", // 숫자이니, 우측으로 정렬
                          paddingRight: "5px",
                        }}
                      />
                    </td>
                    <td style={{ paddingLeft: "2px" }}>원</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        <Card.Footer className="text-center">
          <div className="d-flex justify-content-center mb-3 mt-3 char2button">
            <Button
              type="button"
              // disabled={priceUnchanged()}
              variant="success"
              size="sm"
              className="me-4"
              // onClick={restorePrices}
            >
              {"복원"}
            </Button>
            <Button
              type="submit"
              // disabled={priceUnchanged()}
              variant="primary"
              size="sm"
            >
              {"저장"}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Form>
  );
};

export default DeliveryFeeCard;
