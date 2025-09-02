import { useEffect, useState } from "react";
import { Button, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import AddressModal from "./AddressModal";
import { handlePropChange } from "../util/utilities";

const RecepientInfo = ({ formData, setFormData }) => {
  const [phoneNumber, setPhoneNumber] = useState(`${formData.mbPhone}`);

  const handleKeyDown = (e) => {
    // 허용: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13].includes(e.keyCode) ||
      // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
      (e.keyCode === 65 && e.ctrlKey === true) ||
      (e.keyCode === 67 && e.ctrlKey === true) ||
      (e.keyCode === 86 && e.ctrlKey === true) ||
      (e.keyCode === 88 && e.ctrlKey === true) ||
      // Allow: numbers
      (e.keyCode >= 48 && e.keyCode <= 57) ||
      (e.keyCode >= 96 && e.keyCode <= 105)
    ) {
      return;
    }
    e.preventDefault();
  };

  const handlePhoneChange = (e) => {
    const input = e.target.value;
    const cleaned = input.replace(/\D/g, "");

    if (cleaned.length <= 3) {
      setPhoneNumber(cleaned);
    } else if (cleaned.length <= 7) {
      setPhoneNumber(`${cleaned.slice(0, 3)}-${cleaned.slice(3)}`);
    } else {
      setPhoneNumber(
        `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}`
      );
    }
  };

  useEffect(() => {
    setFormData((prevState) => {
      // Handle regular form fields
      return { ...prevState, mbPhone: phoneNumber };
    });
  }, [phoneNumber]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

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
                onChange={(e) => handlePropChange(e, setFormData)}
                required
              />
            </td>
          </tr>
          <tr>
            <th className="rText">휴대폰</th>
            <td className="boxLeft">
              <OverlayTrigger overlay={<Tooltip>숫자만 :-)</Tooltip>}>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  onKeyDown={handleKeyDown}
                  placeholder="000-0000-0000"
                  maxLength="13"
                  required
                />
              </OverlayTrigger>
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
                onClick={openAddressModal}
              >
                <span className="addrSearchText">검색</span>
              </Button>
              <OverlayTrigger overlay={<Tooltip>수정 불가!</Tooltip>}>
                <input
                  type="text"
                  name="zipcode"
                  size="1"
                  readOnly
                  className="ms-2 readOnly"
                  value={formData.addrBasisAddReq.zipcode}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell">
              <OverlayTrigger overlay={<Tooltip>수정 불가!</Tooltip>}>
                <span>{formData.addrBasisAddReq.roadAddress}</span>
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell" style={{ paddingTop: 0 }}>
              <input
                type="text"
                name="addressDetail"
                size="20"
                value={formData.addressDetail}
                onChange={(e) => handlePropChange(e, setFormData)}
                style={{ fontWeight: 500 }}
              />
            </td>
          </tr>
        </tbody>
      </Table>
      <AddressModal
        show={showAddressModal}
        setFormData={setFormData}
        closer={() => {
          setShowAddressModal(false);
          cartAddResultMap.clear();
        }}
      />
    </div>
  );
};

export default RecepientInfo;
