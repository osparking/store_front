import React, { useState } from "react";

const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const handleChange = (e) => {
    setCreden({ ...credentials, [e.target.name]: e.target.value });
  };
  return <div></div>;
};

export default Login;
