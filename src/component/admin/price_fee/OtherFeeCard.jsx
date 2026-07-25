import _ from "lodash";
import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Form,
  Spinner,
  Table
} from "react-bootstrap";
import "./DeliveryFeeCard.css";

/**
 * feeOther: {
 *   "islandAdd": 4000, // 도서지역 배송 할증료
 *   "deliFreeMin": 40000, // 무료배송 비누가격 최소 금액
 * }
 */
const OtherFeeCard = ({ feeOther }) => {
  const [originFeeOther, setOriginFeeOther] = useState();
  const [shownFeeOther, setShownFeeOther] = useState();

  useEffect(() => {
    if (feeOther) {
      setOriginFeeOther(feeOther);
      setShownFeeOther(feeOther);
    }
  }, [feeOther]);

  const feeData = [
    {
      label: "섬 할증료",
      name: "islandAdd",
      value: shownFeeOther?.islandAdd,
    },
    {
      label: "무료 배송 기준",
      name: "deliFreeMin",
      value: shownFeeOther?.deliFreeMin,
    },
  ];

  const handleChange = (e, itemName) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    // 숫자만 상태에 저장
    const newFeeOther = { ...shownFeeOther };
    newFeeOther[itemName] = Number(numericValue) || 0;
    setShownFeeOther(newFeeOther);
  };

  const feeUnchanged = () => {
    return _.isEqual(shownFeeOther, originFeeOther);
  };

  const restoreFees = () => {
    setShownFeeOther(originFeeOther);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // try {
    //   const requestData = {
    //   };
    //   setIsLoading(true);
    //   const resultData = await saveNewFeeEtc(requestData);
    //   if (resultData && resultData.message) {
    //     toast.success(resultData.message);
    //     setOriginFeeOther(shownFeeOther); // 현재 데이터를 원본으로 설정
    //   }
    // } catch (e) {
    //   toast.error(resultData.message);
    // } finally {
    //   setIsLoading(false);
    // }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
      <Card id="feeEtcCard">
        <Card.Header className="text-center mb-2 h5">
          할증료 무배 기준
        </Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="feeEtcTable" className="my-0">
              <tbody>
                {feeData.map((feeItem, index) => (
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
                        // id={feeItem.name}
                        name={feeItem.name}
                        maxLength={6}
                        onChange={(e) => handleChange(e, feeItem.name)}
                        value={`${(feeItem.value ?? 0).toLocaleString()}`}
                        style={{
                          width: "60px",
                          textAlign: "right",
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
              disabled={feeUnchanged()}
              variant="success"
              size="sm"
              className="me-4"
              onClick={restoreFees}
            >
              {"복원"}
            </Button>
            <Button
              type="submit"
              disabled={feeUnchanged() || isLoading}
              variant="primary"
              size="sm"
              style={{
                whiteSpace: "nowrap",
                padding: "0.375rem 0.75rem",
                fontSize: isLoading ? "0.7rem" : undefined,
                minWidth: "fit-content",
              }}
            >
              {isLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                    style={{ width: "0.8rem", height: "0.8rem" }}
                  />
                  저장 중...
                </>
              ) : (
                "저장"
              )}
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Form>
  );
};

export default OtherFeeCard;
