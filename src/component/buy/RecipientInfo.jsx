import { useEffect, useRef, useState } from "react";
import { Button, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import AddressModal from "./AddressModal";
import RecipientsModal from "../modal/RecipientsModal";
import {
  handlePhoneChange,
  handlePropChange,
  insertHyphens,
} from "../util/utilities.js";
import "./RecipientInfo.css";

const RecipientInfo = ({
  formData,
  setFormData,
  isDefaultRecipient,
  setIsDefaultRecipient,
  putFocus2PayButton,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(formData.mbPhone);
  const [noPurchaseHistory, setNoPurchaseHistory] = useState(true);

  const handleKeyDown = (e) => {
    // 허용: backspace, delete, tab, escape, enter
    if (
      [46, 8, 9, 27, 13, 35, 36, 37, 39].includes(e.keyCode) ||
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

  useEffect(() => {
    setFormData((prevState) => {
      // Handle regular form fields
      return { ...prevState, mbPhone: phoneNumber };
    });
  }, [phoneNumber]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);
  const [focusDetailedAddr, setFocusDetailedAddr] = useState(false);
  const addressDetailInputRef = useRef(null);
  const putFocus2detailedAddr = () => {
    setFocusDetailedAddr(true);
  };

  useEffect(() => {
    if (focusDetailedAddr && addressDetailInputRef.current) {
      setTimeout(() => {
        addressDetailInputRef.current.focus();
        addressDetailInputRef.current.select();
      }, 200);
      setFocusDetailedAddr(false);
    }
  }, [focusDetailedAddr]);

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  const showMyRecipients = () => {
    setShowRecipientsModal(true);
  };

  return (
    <div>
      <Table className="noBorder">
        <tbody>
          <tr>
            <th className="rText">성명</th>
            <td className="boxLeft">
              <div className="d-flex align-items-center gap-2 mt-1">
                <input
                  type="text"
                  name="fullName"
                  size="10"
                  value={formData.fullName}
                  onChange={(e) => handlePropChange(e, setFormData)}
                  required
                />
                <Button
                  id="pastRecipients"
                  variant="warning"
                  className="order-button-width fw-light"
                  onClick={showMyRecipients}
                  disabled={noPurchaseHistory}
                >
                  <span className="boldText">기본 수신처</span>
                </Button>
                <Button
                  id="pastRecipients"
                  variant="warning"
                  className="order-button-width fw-light"
                  onClick={showMyRecipients}
                  disabled={noPurchaseHistory}
                >
                  <span className="boldText">모든 수신처</span>
                </Button>
              </div>
            </td>
          </tr>
          <tr>
            <th className="rText">휴대폰</th>
            <td className="boxLeft" style={{ paddingTop: "0" }}>
              <div className="d-flex align-items-center gap-2">
                <OverlayTrigger overlay={<Tooltip>숫자만 :-)</Tooltip>}>
                  <input
                    type="tel"
                    value={insertHyphens(formData.mbPhone)}
                    onChange={(e) => handlePhoneChange(e, setPhoneNumber)}
                    onKeyDown={handleKeyDown}
                    placeholder="000-0000-0000"
                    maxLength="13"
                    size="15"
                    required
                  />
                </OverlayTrigger>
                <OverlayTrigger overlay={<Tooltip>[결 제] 때 저장됨</Tooltip>}>
                  <Form.Check
                    type="checkbox"
                    name="isDefaultRecipient"
                    label="기본 수신처 지정"
                    checked={isDefaultRecipient}
                    onChange={(e) => setIsDefaultRecipient(e.target.checked)}
                  />
                </OverlayTrigger>
              </div>
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
                style={{
                  height: "30px",
                  maxWidth: "75px",
                  marginLeft: "10px",
                  paddingTop: "2px",
                  marginTop: "-5px",
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
                ref={addressDetailInputRef}
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
        formData={formData}
        setFormData={setFormData}
        closer={() => {
          setShowAddressModal(false);
          // cartAddResultMap.clear();
        }}
        putFocus2detailedAddr={putFocus2detailedAddr}
      />
      <RecipientsModal
        show={showRecipientsModal}
        formData={formData}
        setFormData={setFormData}
        closer={() => {
          setShowRecipientsModal(false);
        }}
        setNoPurchaseHistory={setNoPurchaseHistory}
      />
    </div>
  );
};

export default RecipientInfo;
