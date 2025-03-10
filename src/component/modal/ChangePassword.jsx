import React, { useState } from "react";
import { eyeOff } from "react-icons-kit/feather";

const ChangePassword = () => {
  const [type, setType] = useState("password");
  const { icon, setIcon } = useState(eyeOff);
  return <div>ChangePassword</div>;
};

export default ChangePassword;
