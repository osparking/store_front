import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useState } from "react";
import toast from "react-hot-toast";
import { callWithToken } from "../util/api";

const QRcodeBox = ({ qrCodeUrl, setTwoFaEnabled, setShowQrCode }) => {
  const [qrRevealed, setQrRevealed] = useState(false);
  const [beingVerified, setBeingVerified] = useState(false);
  const [code, setCode] = useState("");

  const revealQRcode = () => {
    setQrRevealed(true);
  };

  const verify2FA = async () => {
    if (!code || code.trim().length === 0)
      return toast.error("구글 인증기 제공 코드를 입력하세요.");

    setBeingVerified(true);

    try {
      const formData = new URLSearchParams();
      formData.append("code", code);
      const result = await callWithToken("post", "/autho/verify-2fa", formData);

      toast.success(result?.message);
      setQrRevealed(false);
      setShowQrCode(false);
      setTwoFaEnabled(true);
    } catch (error) {
      console.log("error " + error);
      toast.error(error?.response?.data);
    } finally {
      setBeingVerified(false);
    }
  };

  return (
    <div className="py-2" id="box-2FA">
      <h5 className="font-bold text-slate-700">
        <button id="QRcodeButton" onClick={revealQRcode}>
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
      <div>
        {qrRevealed && (
          <div id="twoFA-QR-div">
            <img src={qrCodeUrl} alt="QR 코드" />
            <div className="flex items-center gap-1">
              <input
                id="googleAuthenticatorCode"
                type="text"
                placeholder="(구글 인증자 코드 입력)"
                value={code}
                required
                onChange={(e) => setCode(e.target.value)}
              />
              <button
                id="googleCodeVerifyButton"
                disabled={beingVerified}
                className="px-3 h-10 rounded-md mt-3 mb-3"
                onClick={verify2FA}
              >
                입력한 코드 검증
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRcodeBox;
