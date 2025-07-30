import { Alert } from "react-bootstrap";

export default function AlertMessage({ type, message, severity }) {
  if (!message) return null;
  console.log("type: " + type + ", message: " + message);
  return (
    <Alert variant={type} severity={severity} dismissible>
      {message}
    </Alert>
  );
}
