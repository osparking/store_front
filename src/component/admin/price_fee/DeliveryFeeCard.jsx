import { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
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
