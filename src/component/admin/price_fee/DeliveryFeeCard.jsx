import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Card, Form, Spinner, Table } from "react-bootstrap";
import toast from "react-hot-toast";
import { saveFeeRegion } from "../AdminService";
import "./DeliveryFeeCard.css";

/**
 * 
 * @param {*} feeRegion
 *  [
      {
        "areaSame": 4100,
        "areaDiff": 4600,
        "areaJeju": 7600,
      },
      {
        "areaSame": 5100,
        "areaDiff": 5600,
        "areaJeju": 8600,
      }
    ]
 * @returns 권역 및 비누상자 규격(중량)별 배송비 관리 테이블
 */
const DeliveryFeeCard = ({ feeRegion }) => {
  const [originFeeRegion, setOriginFeeRegion] = useState([]);
  const [shownFeeRegion, setShownFeeRegion] = useState([]);

  useEffect(() => {
    // 1. 배열인지 확인
    if (Array.isArray(feeRegion)) {
      // 2. shown은 항상 최신 prop으로 갱신
      setShownFeeRegion([...feeRegion]);

      // 3. origin은 아직 비어있고(초기 상태), 지금 받은 feeRegion이 비어있지 않을 때만 저장 (최초 1회)
      setOriginFeeRegion((prev) => {
        // prev.length === 0 이면 아직 origin이 설정되지 않음
        if (prev.length === 0 && feeRegion.length > 0) {
          return [...feeRegion];
        }
        return prev; // 이미 origin이 있으면 유지
      });
    }
  }, [feeRegion]); // prop이 바뀔 때마다 이 useEffect 실행

  const deliveryData = [
    {
      label: "수도권 배송비",
      name: "areaSame",
      value03: shownFeeRegion[0]?.areaSame,
      value12: shownFeeRegion[1]?.areaSame,
    },
    {
      label: "지방권 배송비",
      name: "areaDiff",
      value03: shownFeeRegion[0]?.areaDiff,
      value12: shownFeeRegion[1]?.areaDiff,
    },
    {
      label: "제주권 배송비",
      name: "areaJeju",
      value03: shownFeeRegion[0]?.areaJeju,
      value12: shownFeeRegion[1]?.areaJeju,
    },
  ];

  const handleChange = (e, idx, itemName) => {
    const numericValue = e.target.value.replace(/[^0-9]/g, "");
    const newValue = Number(numericValue) || 0;

    // 함수형 업데이트로 최신 상태 보장 + 불변성 확보
    setShownFeeRegion((prev) => {
      // prev가 배열인지 확인 (안전장치)
      if (!Array.isArray(prev)) return prev;

      // 해당 인덱스의 객체만 새로 만들고, 나머지는 그대로 복사
      return prev.map((item, index) => {
        if (index === idx) {
          // 해당 객체를 펼쳐서 새로운 객체로 만들고, 해당 필드만 업데이트
          return { ...item, [itemName]: newValue };
        }
        return item; // 변경 없는 항목은 그대로 반환 (참조 유지해도 무방)
      });
    });
  };

  const feeUnchanged = () => {
    return _.isEqual(shownFeeRegion, originFeeRegion);
  };

  const restoreFees = () => {
    setShownFeeRegion(originFeeRegion);
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 로딩은 반복문 밖에서 한 번만 켭니다.
    setIsLoading(true);

    try {
      // for...of를 사용하면 await을 자연스럽게 순차적으로 처리할 수 있습니다.
      for (let idx = 0; idx < shownFeeRegion.length; idx++) {
        const feeRegion = shownFeeRegion[idx];

        // 변경된 항목이 있을 때만 저장 요청
        if (!_.isEqual(feeRegion, originFeeRegion[idx])) {
          const reginalDeliveryFee = {
            boxSize: idx === 0 ? 3 : 12,
            areaSame: feeRegion.areaSame,
            areaDiff: feeRegion.areaDiff,
            areaJeju: feeRegion.areaJeju,
          };

          const resultData = await saveFeeRegion(reginalDeliveryFee);

          if (resultData?.message) {
            toast.success(resultData.message);
          }
        }
      }

      // 모든 저장이 성공적으로 끝나면 원본 데이터를 최신 상태로 갱신
      setOriginFeeRegion([...shownFeeRegion]);
    } catch (error) {
      // catch에서는 try 내부에서 던져진 에러 객체(error)를 사용해야 합니다.
      toast.error(error?.message || "권역별 배송비 저장 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const headRow = () => {
    return (
      <tr style={{ height: "16px" }}>
        <td md={6}></td>
        <td md={3} className="p-0 ps-2">
          <span className="soap-color">비누 3</span>
        </td>
        <td md={3} className="p-0 ps-2 soap-color">
          <span className="soap-color">비누 12</span>
        </td>
      </tr>
    );
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex justify-content-center">
      <Card id="feeEtcCard">
        <Card.Header className="text-center mb-2 h5">권역별 배송비</Card.Header>
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div style={{ overflow: "auto" }}>
            <Table id="feeEtcTable" className="my-0">
              <tbody>
                {headRow()}
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
                        // id={feeItem.name}
                        name={feeItem.name}
                        maxLength={6}
                        onChange={(e) => handleChange(e, 0, feeItem.name)}
                        value={`${(feeItem.value03 ?? 0).toLocaleString()}`}
                        style={{
                          width: "60px",
                          textAlign: "right",
                          paddingRight: "5px",
                        }}
                      />
                    </td>
                    <td md={3} className="p-0" style={{ minWidth: "60px" }}>
                      <Form.Control
                        type="text"
                        placeholder="0.00"
                        // id={feeItem.name}
                        name={feeItem.name}
                        maxLength={6}
                        onChange={(e) => handleChange(e, 1, feeItem.name)}
                        value={`${(feeItem.value12 ?? 0).toLocaleString()}`}
                        className="ms-2"
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

export default DeliveryFeeCard;
