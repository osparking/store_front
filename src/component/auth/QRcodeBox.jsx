import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";

const QRcodeBox = ({ qrCodeUrl, setTwoFaEnabled, setShowQrCode }) => {
  const [qrRevealed, setQrRevealed] = useState(false);

  const showDetails = () => {
    setRevealQR(true);
  };

  return (
    <div className="py-3">
      <h5 className="font-bold text-slate-700">
        <button onClick={showDetails}>
          QR 코드 -{" "}
          {qrRevealed ? (
            "스캔할 것"
          ) : (
            <span>
              확장할 것<ArrowDropDownIcon />
            </span>
          )}
        </button>
      </h5>
      <div>{qrRevealed && <div></div>}</div>
    </div>
  );
};

export default QRcodeBox;
