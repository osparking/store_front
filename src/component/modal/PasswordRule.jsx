import React from "react";
import "./PasswordRule.css";
import { Button } from "react-bootstrap";

const PasswordRule = () => {
  return (
    <div>
      <li id="pwdRuleTopRow">허용 문자 유형: 영대, 영소, 숫자, 특수</li>
      <ul>
        <li className="no-bullet">
          (특수)
          <span style={{ letterSpacing: "1px" }}>
            {" "}
            ! @ # $ % ^ & * ( ) - _ = +
          </span>
        </li>
      </ul>
      <li id="midBreak">문자 유형별 한 자 이상 사용</li>
      <li>허용 문자만으로 길이 9 자 이상</li>
    </div>
  );
};

export default PasswordRule;
