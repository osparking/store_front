import _ from "lodash";
import { useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Form, useLocation, useNavigate } from "react-router-dom";
import AlertMessage from "../common/AlertMessage";
import BsAlertHook from "../hook/BsAlertHook";
import { getDefaultRecipient } from "../user/UserService.js";
import { insertHyphens } from "../util/utilities.js";
import CheckoutCart from "./CheckoutCart";
import { getDeliveryFee } from "./orderService";
import "./recipient.css";
import RecipientInfo from "./RecipientInfo";
import ConfirmationModal from "../modal/ConfirmationModal.jsx";

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
  const { formItems, subTotal, source, recipient, wasDefaultRecipient } =
    location.state || [];
  let productList = undefined;

  const [recipientDefault, setRecipientDefault] = useState(null);
  const user = JSON.parse(localStorage.getItem("USER"));

  useEffect(() => {
    const readDefaultRecipient = async () => {
      try {
        const response = await getDefaultRecipient(user.id);
        const recipientDto = response.data;
        console.log("response.data:", JSON.stringify(recipientDto));

        if (recipientDto) {
          setRecipientDefault({
            addressDetail: recipientDto.addressDetail,
            doroZbun: recipientDto.doroZbun,
            addrBasisAddReq: {
              zipcode: recipientDto.zipcode,
              roadAddress: recipientDto.roadAddress,
              zbunAddress: recipientDto.zbunAddress,
            },
            mbPhone: recipientDto.mbPhone,
            fullName: recipientDto.fullName,
          });
        }
      } catch (error) {
        console.error("Error fetching default recipient:", error);
      }
    };
    readDefaultRecipient();
  }, []);

  // source 에 따라 productList 를 다르게 만들어 배정
  if (source === "shoppingCart") {
    productList = formItems
      .filter((item) => item.isChecked)
      .map((item) => {
        return {
          count: item.count,
          shapeLabel: item.shapeLabel,
          subTotal: item.subTotal,
        };
      });
  } else if (source) {
    // formItems 각 항목에 shapeLabel 과 subTotal 추가
    productList = formItems.map((item) => {
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
    mbPhone: `${insertHyphens(user.mbPhone)}`,
    fullName: `${user.fullName}`,
  };

  const [formData, setFormData] = useState(
    recipient || recipientDefault || recipientEmpty,
  );

  useEffect(() => {
    if (!recipient && recipientDefault) {
      setFormData(recipientDefault);
      setIsDefaultRecipient(true);
    }
  }, [recipientDefault]);

  const [isDefaultRecipient, setIsDefaultRecipient] = useState(
    wasDefaultRecipient === undefined
      ? recipientDefault !== null
      : wasDefaultRecipient,
  );
  const [deliveryFee, setDeliveryFee] = useState(0);

  useEffect(() => {
    const callGetDeliveryFee = async () => {
      const result = await getDeliveryFee({
        zipcode: formData.addrBasisAddReq.zipcode,
        grandTotal: subTotal.price,
      });
      setDeliveryFee(result.data);
      console.log("delivery fee: ", result.data);
    };
    if (formData.addrBasisAddReq.zipcode) {
      callGetDeliveryFee();
    }
  }, [formData.addrBasisAddReq.zipcode]);

  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  const gotoCheckout = async (e) => {
    e.preventDefault();

    if (formData.addressDetail.trim() === "") {
      setShowAddressConfirm(true);
      return;
    }
    navigateToCheckout();
  };

  const navigateToCheckout = () => {
    // 현재까지 수집된 주문 정보를 일단 저장
    const userId = localStorage.getItem("LOGIN_ID");
    const items = productList.map((item) => ({
      shape: item.shapeLabel,
      count: item.count,
    }));
    
    const orderData = {
      userId: userId,
      items: items,
      recipRegiReq: formData,
      orderStatus: "결제대기",
      orderName: items[0].shape + " " + items[0].count + "개 등",
    };

    const feeData = {
      productTotal: grandTotal,
      deliveryFee: deliveryFee,
      amount: grandTotal + deliveryFee,
    };

    navigate("/checkout", {
      state: {
        orderData: orderData,
        feeData: feeData,
        formItems: formItems,
        source: source,
        toDefaultRecipient: _.isEqual(recipientDefault, formData),
        isDefaultRecipient: isDefaultRecipient,
      },
    });    
  }

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
          formItems: formItems,
          recipient: formData,
          isDefaultRecipient: isDefaultRecipient,
          showCart: true,
        },
      });
    } else {
      navigate("/buy_soap", {
        state: {
          formItems: formItems,
          recipient: formData,
          isDefaultRecipient: isDefaultRecipient,
        },
      });
    }
  };

  const mbPhoneOk = () => {
    return formData.mbPhone.length === 13;
  };

  const handleConfirm = async () => {
    setShowAddressConfirm(false);
      
  }  

  return (
    <>
      <ConfirmationModal
        show={showAddressConfirm}
        handleClose={() => setShowAddressConfirm(false)}
        handleConfirm={handleConfirm}
        bodyMessage={"'상세 주소' 가 없습니다. 바른 주소입니까?"}
        title={"주소 확인"}
        noLabel={"수정할께요."}
        yesLabel={"네, 그래요."}
      />
      <div style={{ width: "95%", maxWidth: "950px", margin: "auto" }}>
        <div className="d-flex justify-content-center ">
          <Row className="pt-4 pb-2 mt-3 rowStyle dark">
            <Col md={8}>
              <h5 className="centered">결제 내역</h5>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-center">
          <Row className="justify-content-center pb-1 rowStyle">
            <Col xs={11} md={9}>
              <div>
                <CheckoutCart subTotal={subTotal} deliveryFee={deliveryFee} />
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
          <div className="d-flex justify-content-center ">
            <Row className="justify-content-center pb-5 rowStyle">
              <Col xs={11} md={9}>
                <div className="table-container">
                  <RecipientInfo
                    formData={formData}
                    setFormData={setFormData}
                    isDefaultRecipient={isDefaultRecipient}
                    setIsDefaultRecipient={setIsDefaultRecipient}
                  />
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
              className="justify-content-center pb-5 rowStyle"
              style={{ display: "flex", gap: "20px" }}
            >
              <Button
                variant="info"
                className="pt-2 pb-2 order-button-width"
                onClick={goBack}
              >
                <span className="boldText">뒤로</span>
              </Button>
              <Button
                type="submit"
                variant="success"
                className="pt-2 pb-2 order-button-width"
                disabled={
                  !formData.fullName ||
                  !(formData.mbPhone && mbPhoneOk()) ||
                  !formData.addrBasisAddReq.zipcode
                }
              >
                <span className="boldText">결제</span>
              </Button>
            </Row>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Recipient;
