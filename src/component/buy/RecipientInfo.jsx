import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Form, OverlayTrigger, Table, Tooltip } from "react-bootstrap";
import RecipientsModal from "../modal/RecipientsModal";
import { handlePhoneChange, insertHyphens } from "../util/utilities.js";
import AddressModal from "./AddressModal";
import { useOrderDataStore } from "./orderDataStore.js";
import "./RecipientInfo.css";

const RecipientInfo = ({ addressDetailInputRef, setFocusDetailedAddr }) => {
  const { recipient, setMemberData } = useOrderDataStore();

  const [phoneNumber, setPhoneNumber] = useState(recipient?.formUse?.mbPhone);
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
    if (!phoneNumber) return;

    setMemberData("recipient", {
      ...recipient,
      formUse: { ...recipient.formUse, mbPhone: phoneNumber },
    });
  }, [phoneNumber]);

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showRecipientsModal, setShowRecipientsModal] = useState(false);

  const putFocus2detailedAddr = () => {
    setFocusDetailedAddr(true);
  };

  const openAddressModal = () => {
    setShowAddressModal(true);
  };

  const showMyRecipients = () => {
    setShowRecipientsModal(true);
  };

  const loadDefaultRecipient = () => {
    setMemberData("recipient", { ...recipient, formUse: recipient.default });
  };

  const defaultLoaded = _.isEqual(recipient.formUse, recipient.default);
  const disableDefaultCheckbox = !recipient.default || defaultLoaded;

  const defaultCheckboxChanged = (e) => {
    setMemberData("recipient", {
      ...recipient,
      defaultChecked: e.target.checked,
    });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setMemberData("recipient", {
      ...recipient,
      formUse: { ...recipient.formUse, [name]: value },
    });
  };

  if (
    recipient.formUse === null ||
    recipient.formUse.addrBasisAddReq === undefined
  ) {
    return;
  }

  return (
    <div>
      <Table className="noBorder">
        <tbody>
          <tr>
            <th className="rText">성명</th>
            <td className="boxLeft">
              <div className="char4button d-flex align-items-center gap-2 mt-1">
                <input
                  type="text"
                  name="fullName"
                  size="10"
                  value={recipient.formUse?.fullName}
                  onChange={handleTextChange}
                  required
                  style={{ borderWidth: "thin" }}
                />
                <OverlayTrigger overlay={<Tooltip>기본 값 로딩</Tooltip>}>
                  <Button
                    id="defaultRecipient"
                    variant="primary"
                    className="fw-light"
                    onClick={loadDefaultRecipient}
                    // 기본 주소가 없거나, 이미 기본 주소가 로딩된 경우 버튼 비활성화
                    disabled={!recipient.default || defaultLoaded}
                  >
                    <span className="boldText">기본 주소</span>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={<Tooltip>과거 수신처 중 선택</Tooltip>}
                >
                  <Button
                    id="pastRecipients"
                    variant="success"
                    className="fw-light"
                    onClick={showMyRecipients}
                    disabled={noPurchaseHistory}
                  >
                    <span className="boldText">모든 주소</span>
                  </Button>
                </OverlayTrigger>
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
                    value={insertHyphens(recipient.formUse?.mbPhone)}
                    onChange={(e) => handlePhoneChange(e, setPhoneNumber)}
                    onKeyDown={handleKeyDown}
                    placeholder="000-0000-0000"
                    maxLength="13"
                    size="15"
                    required
                  />
                </OverlayTrigger>
                <OverlayTrigger
                  overlay={<Tooltip>[결제 진행] 때 저장됨</Tooltip>}
                >
                  <Form.Check
                    id="default-recipient-checkbox"
                    type="checkbox"
                    name="isDefaultRecipient"
                    label="새 기본 주소로 지정"
                    checked={recipient.defaultChecked}
                    onChange={defaultCheckboxChanged}
                    disabled={disableDefaultCheckbox}
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
                  value={recipient.formUse?.addrBasisAddReq.zipcode}
                />
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell pt-0">
              <OverlayTrigger overlay={<Tooltip>수정 불가!</Tooltip>}>
                <span>{recipient.formUse?.addrBasisAddReq.roadAddress}</span>
              </OverlayTrigger>
            </td>
          </tr>
          <tr>
            <td className="boxLeft goldCell pt-0">
              <OverlayTrigger
                placement="left"
                overlay={<Tooltip>상세 주소</Tooltip>}
              >
                <input
                  ref={addressDetailInputRef}
                  type="text"
                  name="addressDetail"
                  size="20"
                  value={recipient.formUse?.addressDetail}
                  onChange={handleTextChange}
                  style={{ fontWeight: 500 }}
                />
              </OverlayTrigger>
            </td>
          </tr>
        </tbody>
      </Table>
      <AddressModal
        show={showAddressModal}
        closer={() => {
          setShowAddressModal(false);
        }}
        putFocus2detailedAddr={putFocus2detailedAddr}
      />
      <RecipientsModal
        show={showRecipientsModal}
        closer={() => {
          setShowRecipientsModal(false);
        }}
        setNoPurchaseHistory={setNoPurchaseHistory}
      />
    </div>
  );
};

export default RecipientInfo;
