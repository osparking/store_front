import { Alert } from "react-bootstrap";

export default function AlertMessage({ type, message, severity }) {
  if (!message) return null;
  return (
    <Alert variant={type} severity={severity} dismissible>
      {message}
    </Alert>
  );
}
