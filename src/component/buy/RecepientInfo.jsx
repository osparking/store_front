import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";

const RecepientInfo = ({ formData, setFormData }) => {
  const [phoneNumber] = useState(`${formData.mbPhone}`);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    setFormData((prevState) => {
      // Handle regular form fields
      return { ...prevState, mbPhone: phoneNumber };
    });
  }, [phoneNumber]);

  return (
    <div>
      <Table className="noBorder">
        <tbody>
          <tr>
            <th className="rText">성명</th>
            <td className="boxLeft">
              <input
                type="text"
                name="fullName"
                size="12"
                value={formData.fullName}
                onChange={handleSubmit}
              />
            </td>
          </tr>
          <tr>
            <th className="rText">휴대폰</th>
            <td className="boxLeft">
              <input
                type="tel"
                value={phoneNumber}
                placeholder="000-0000-0000"
                maxLength="13"
              />
            </td>
          </tr>
          <tr>
            <th className="rText align-middle" rowSpan={3}>
              주소
            </th>
            <td
              className="boxLeft goldCell"
              style={{
                paddingLeft: 0,
                paddingTop: 10,
                marginLeft: 10,
              }}
            >
              <Button
                variant="primary"
                className="w-25 ddrSearchButton"
                type="submit"
                style={{
                  height: "30px",
                  paddingTop: "2px",
                  marginTop: "-5px",
                  marginLeft: 0,
                }}
              >
                <span className="addrSearchText">검색</span>
              </Button>
              <OverlayTrigger overlay={<Tooltip>수정 불가!</Tooltip>}>
                <input
                  type="text"
                  name="zipcode"
                  size="1"
                  className="ms-2 readOnly"
                  value={formData.addrBasisAddReq.zipcode}
                  onChange={handleSubmit}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell">
              <textarea
                name="mbPhone"
                rows="2"
                cols="45"
                readonly
                value={formData.addrBasisAddReq.roadAddress}
                onChange={handleSubmit}
              />
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell" style={{ paddingTop: 0 }}>
              <input
                type="text"
                name="mbPhone"
                size="20"
                value={formData.addressDetail}
                onChange={handleSubmit}
                style={{ fontWeight: 500 }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default RecepientInfo;
