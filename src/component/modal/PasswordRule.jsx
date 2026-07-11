import React from "react";
import "./PasswordRule.css";
import { Button } from "react-bootstrap";

const PasswordRule = () => {
  return (
    <ul className="password-rules">
      <li>허용 문자 유형: 영대, 영소, 숫자, 특수</li>
      <ul className="special-chars">
        <li>
          (특수)
          <span className="special-char-list">
            {" "}
            ! @ # $ % ^ & * ( ) - _ = +
          </span>
        </li>
      </ul>
      <li>문자 유형별 한 자 이상 사용</li>
      <li>허용 문자만으로 길이 9 자 이상</li>
    </ul>
  );
};

export default PasswordRule;
