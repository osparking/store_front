import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Form, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import ConfirmationModal from "../modal/ConfirmationModal.jsx";
import { getDefaultRecipient } from "../user/UserService.js";
import CheckoutCart from "./CheckoutCart";
import { useOrderDataStore } from "./orderDataStore.js";
import { getDeliveryFee } from "./orderService";
import "./recipient.css";
import RecipientInfo from "./RecipientInfo";
import { mbPhoneOk } from "../util/utilities.js";

export const PayButtonContext = React.createContext();

const Recipient = () => {
  const {
    successMsg,
    setSuccessMsg,
    alertSuccess,
    setAlertSuccess,
    errorMsg,
    setErrorMsg,
    alertError,
    setAlertError,
  } = BsAlertHook();

  const location = useLocation();
  const { source } = location.state || [];
  let productList = undefined;

  const { formData, recipient, setMemberData } = useOrderDataStore();

  const user = JSON.parse(localStorage.getItem("USER"));

  useEffect(() => {
    const readDefaultRecipient = async () => {
      if (!user || recipient.formUse) {
        return;
      }

      try {
        const response = await getDefaultRecipient(user.id);
        const recipientDto = response.data;
        console.log("response.data:", JSON.stringify(recipientDto));

        let defaultRecipient = null;

        if (recipientDto) {
          defaultRecipient = {
            addressDetail: recipientDto.addressDetail,
            doroZbun: recipientDto.doroZbun,
            addrBasisAddReq: {
              zipcode: recipientDto.zipcode,
              roadAddress: recipientDto.roadAddress,
              zbunAddress: recipientDto.zbunAddress,
            },
            mbPhone: recipientDto.mbPhone,
            fullName: recipientDto.fullName,
          };
        }
        setMemberData("recipient", {
          default: defaultRecipient,
          formUse: defaultRecipient || recipientEmpty,
        });
      } catch (error) {
        console.error("Error fetching default recipient:", error);
      }
    };
    readDefaultRecipient();
  }, [user, recipient]);

  // source 에 따라 productList 를 다르게 만들어 배정
  if (source === "shoppingCart") {
    productList = formData.items
      .filter((item) => item.isChecked)
      .map((item) => {
        return {
          count: item.count,
          shapeLabel: item.shapeLabel,
          subTotal: item.subTotal,
        };
      });
  } else if (source) {
    // formData.items 각 항목에 shapeLabel 과 subTotal 추가
    productList = formData.items.map((item) => {
      const paren = item.shape.indexOf("(");
      return {
        count: item.count,
        shapeLabel: item.shape.slice(0, paren),
        subTotal: item.count * item.price,
      };
    });
  }

  const calcGrandTotal = (productList) => {
    if (productList === undefined) return "";

    const grand = productList
      .map((prod) => prod.subTotal)
      .reduce((sum, num) => sum + num, 0);
    return grand;
  };

  const [grandTotal] = useState(calcGrandTotal(productList));
  const recipientEmpty = {
    addressDetail: "",
    doroZbun: "도로",
    addrBasisAddReq: {
      zipcode: "",
      roadAddress: "",
      zbunAddress: "",
    },
    mbPhone: user?.mbPhone,
    fullName: user?.fullName,
  };

  useEffect(() => {
    if (!recipient && recipient.default) {
      setMemberData("formData", recipient.default);
    }
  }, [recipient.default]);

  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    if (
      recipient.formUse &&
      recipient.formUse.addrBasisAddReq &&
      recipient.formUse?.addrBasisAddReq.zipcode
    ) {
      const callGetDeliveryFee = async () => {
        const result = await getDeliveryFee({
          zipcode: recipient.formUse?.addrBasisAddReq.zipcode,
          soapCount: formData.subTotal.count,
          grandTotal: formData.subTotal.price,
        });
        setDeliveryFee(result.data);
        console.log("delivery fee: ", result.data);
      };
      if (recipient.formUse?.addrBasisAddReq.zipcode) {
        callGetDeliveryFee();
      }
    }
  }, [recipient.formUse]);

  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const gotoCheckout = async (e) => {
    e.preventDefault();
    sessionStorage.removeItem("paymentCompleted");
    if (recipient.formUse.addressDetail.trim() === "") {
      setShowAddressConfirm(true);
      return;
    }
    navigateToCheckout();
  };

  const navigateToCheckout = () => {
    // 현재까지 수집된 주문 정보를 일단 저장
    try {
      const userId = localStorage.getItem("LOGIN_ID");
      const items = productList.map((item) => ({
        shape: item.shapeLabel,
        count: item.count,
      }));

      setMemberData("orderData", {
        userId: userId,
        items: items,
        recipRegiReq: recipient.formUse,
        orderStatus: "결제대기",
        orderName: items[0].shape + " " + items[0].count + "개 등",
        amount: grandTotal + deliveryFee,
      });

      navigate("/checkout", {
        state: {
          source: source,
        },
      });
    } catch (error) {
      toast.error(error.message);
      navigate("/login");
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (productList === undefined) {
      navigate("/buy_soap");
    }
  }, [productList]);

  const goBack = () => {
    if (source === "shoppingCart") {
      navigate("/shopping_cart", {
        state: {
          formItems: formData.items,
          recipient: recipient.formUse,
          showCart: true,
        },
      });
    } else {
      navigate("/buy_soap", {
        state: {
          showCart: false,
        },
      });
    }
  };

  const handleConfirm = async () => {
    setShowAddressConfirm(false);
    navigateToCheckout();
  };

  const payButtonRef = useRef(null);
  const [focusPayButton, setFocusPayButton] = useState(false);

  useEffect(() => {
    if (focusPayButton && payButtonRef.current) {
      setTimeout(() => {
        payButtonRef.current.classList.add("boxShadow");
        payButtonRef.current.focus();
      }, 200);
      setFocusPayButton(false);
    }
  }, [focusPayButton]);

  const putFocus2PayButton = () => {
    setFocusPayButton(true);
  };

  const addressDetailInputRef = useRef(null);
  const [focusDetailedAddr, setFocusDetailedAddr] = useState(false);

  useEffect(() => {
    if (focusDetailedAddr && addressDetailInputRef.current) {
      setTimeout(() => {
        addressDetailInputRef.current.focus();
        addressDetailInputRef.current.select();
      }, 200);
      setFocusDetailedAddr(false);
    }
  }, [focusDetailedAddr]);

  const closeAndFocus = () => {
    setShowAddressConfirm(false);
    setFocusDetailedAddr(true);
  };

  return (
    <>
      <ConfirmationModal
        show={showAddressConfirm}
        handleClose={closeAndFocus}
        handleConfirm={handleConfirm}
        bodyMessage={"'상세 주소' 가 없습니다. 바른 주소입니까?"}
        title={"주소 확인"}
        noLabel={"주소 수정"}
        yesLabel={"바른 주소"}
        dialogClassName={"no-detail-address-confirm"}
      />
      <div id="recipientDiv" className="d-flex">
        <div style={{ width: "100%", height: "fit-content", overflow: "auto" }}>
          <div className="d-flex justify-content-center ">
            <Row className="pt-4 pb-2 mt-0 rowStyle dark">
              <Col md={8}>
                <h5 className="centered">결제 내역</h5>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-center">
            <Row className="justify-content-center pb-1 rowStyle">
              <Col xs={11} md={9}>
                <div>
                  <CheckoutCart
                    subTotal={formData.subTotal}
                    deliveryFee={deliveryFee}
                  />
                </div>
              </Col>
            </Row>
          </div>
          <div className="d-flex justify-content-center ">
            <Row className="pt-4 pb-2 rowStyle dark">
              <Col md={8}>
                <h5 className="centered">수신처</h5>
              </Col>
            </Row>
          </div>
          <Form onSubmit={gotoCheckout}>
            <div className="d-flex justify-content-center">
              <Row className="justify-content-center pb-4 rowStyle">
                <Col xs={11} md={9}>
                  <div className="table-container">
                    <PayButtonContext.Provider value={{ putFocus2PayButton }}>
                      <RecipientInfo
                        addressDetailInputRef={addressDetailInputRef}
                        setFocusDetailedAddr={setFocusDetailedAddr}
                      />
                    </PayButtonContext.Provider>
                  </div>
                </Col>
              </Row>
            </div>
            <div className="d-flex justify-content-center ">
              <Row className="justify-content-center rowStyle">
                <Col md={4} style={{ minWidth: "350px" }}>
                  {alertSuccess && (
                    <AlertMessage type={"success"} message={successMsg} />
                  )}
                  {alertError && (
                    <AlertMessage type={"danger"} message={errorMsg} />
                  )}
                </Col>
              </Row>
            </div>
            <div className="d-flex justify-content-center ">
              <Row
                className="char4button justify-content-center pb-5 rowStyle"
                style={{ display: "flex", gap: "20px" }}
              >
                <Button variant="info" className="p-0" onClick={goBack}>
                  내역 수정
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="p-0"
                  disabled={
                    !recipient.formUse?.fullName ||
                    !(
                      recipient.formUse?.mbPhone &&
                      mbPhoneOk(recipient.formUse.mbPhone)
                    ) ||
                    !recipient.formUse?.addrBasisAddReq.zipcode
                  }
                  ref={payButtonRef}
                  onBlur={() => {
                    payButtonRef.current?.classList.remove("boxShadow");
                  }}
                  style={{ fontWeight: 500 }}
                >
                  결제 진행
                </Button>
              </Row>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Recipient;
