import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Card, Form, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { getSoapPrices, saveNewSoapPrice } from "../AdminService";
import "./SoapPriceCard.css";

const SoapPriceCard = () => {
  const [soapPrices, setSoapPrices] = useState([]);
  const [originPrices, setOriginPrices] = useState([]);

  useEffect(() => {
    const readPrices = async () => {
      const priceData = await getSoapPrices();

      setOriginPrices(priceData.data);
      setSoapPrices(priceData.data);
    };
    readPrices();
  }, []);

  const handleSubmit = async () => {
    console.log(soapPrices, originPrices);
    let allSuccessful = true;
    let resultData;

    for (let i = 0; i < soapPrices.length; i++) {
      if (soapPrices[i].unitPrice !== originPrices[i].unitPrice) {
        const soapPrice = {
          shapeOrdinal: soapPrices[i].shapeOrdinal,
          unitPrice: soapPrices[i].unitPrice,
        };

        try {
          resultData = await saveNewSoapPrice(soapPrice);
        } catch (e) {
          toast.error(resultData.message);
          allSuccessful = false;
        }
      }
    }
    // 최대 3 건의 가격 갱신이 모두 성공한 경우 토스트&재적재
    if (allSuccessful) {
      toast.success(resultData.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const priceUnchanged = () => {
    return _.isEqual(soapPrices, originPrices);
  };

  const restorePrices = () => {
    setSoapPrices(originPrices);
  };

  const getClasses = () => {};

  const handleChange = (e, index) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    // 숫자만 상태에 저장
    setSoapPrices((prev) => {
      const updatedPrices = [...prev];

      updatedPrices[index] = {
        ...updatedPrices[index],
        unitPrice: Number(numericValue) || 0,
      };
      return updatedPrices;
    });
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
      <Card id="soapPriceCard">
        <Card.Header className="text-center mb-2 h5">
          비누 외형별 단가
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="soapPrice" className="my-0">
              <tbody>
                {soapPrices?.map((soapPrice, index) => (
                  <tr key={index}>
                    <td
                      md={6}
                      className="text-end"
                      style={{ minWidth: "100px" }}
                    >
                      <Form.Label htmlFor={soapPrice.shapeLabel}>
                        {soapPrice.shapeLabel}
                        {" :"}
                      </Form.Label>
                    </td>
                    <td md={3} style={{ minWidth: "60px", paddingRight: "0" }}>
                      <Form.Control
                        type="text"
                        placeholder="0.00"
                        disabled={soapPrice.disabled}
                        id={soapPrice.shapeLabel}
                        name={soapPrice.name}
                        maxLength={6}
                        onChange={(e) => handleChange(e, index)}
                        value={`${(soapPrice.unitPrice ?? 0).toLocaleString()}`}
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
              disabled={priceUnchanged()}
              variant="success"
              size="sm"
              className="me-4"
              onClick={restorePrices}
            >
              {"복원"}
            </Button>
            <Button
              type="submit"
              disabled={priceUnchanged()}
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

export default SoapPriceCard;
