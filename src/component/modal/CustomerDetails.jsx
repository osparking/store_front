import React from "react";
import "./CustomerDetails.css";
import { Form, Table } from "react-bootstrap";
import { insert2Hyphens } from "../util/utilities";

function CustomerDetails({ customer }) {
  const detailsItem = [
    {
      label: "아이디",
      name: "id",
      value: customer.id,
    },
    {
      label: "성명",
      name: "fullName",
      value: customer.fullName,
    },
    {
      label: "휴대폰",
      name: "mbPhone",
      value: insert2Hyphens(customer.mbPhone),
    },
    {
      label: "이메일",
      name: "email",
      value: customer.email,
    },
    {
      label: "기본 수신처",
      name: "recipientSet",
      value: customer.recipientSet ? "지정됨" : "미지정",
    },
    {
      label: "등록 형태",
      name: "signUpMethod",
      value: customer.signUpMethod,
    },
    {
      label: "등록 일시",
      name: "addDate",
      value: customer.addDate,
    },
    {
      label: "유저 구분",
      name: "userType",
      value: customer.userType,
    },
    {
      label: "로그인",
      name: "enabled",
      value: customer.enabled ? "가능" : "불가능",
    },
    {
      label: "구글 이중 인증(2FA)",
      name: "twoFaEnabled",
      value: customer.twoFaEnabled ? "활성화됨" : "비활성임",
    },
  ];

  return (
    <Form className="d-flex justify-content-center">
      <Table id="customerDetails" className="my-0" style={{ width: "75%" }}>
        <tbody>
          {detailsItem.map((item, index) => (
            <tr key={index}>
              <td
                md={4}
                className="text-end"
                style={{ minWidth: "160px", paddingRight: 0 }}
              >
                <Form.Label htmlFor={item.name}>{item.label} :</Form.Label>
              </td>
              <td
                md={7}
                colSpan={2}
                style={{ minWidth: "270px", paddingLeft: "4px" }}
              >
                <Form.Control
                  id={item.name}
                  name={item.name}
                  plaintext
                  readOnly
                  defaultValue={item.value}
                  className={"disabled-color ps-2"}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Form>
  );
}

export default CustomerDetails;
