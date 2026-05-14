import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds(seconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [seconds]);

  const handleVerify = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Verification successful");

      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    }
  };

  const resendOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", {
        email,
      });

      toast.success("OTP resent successfully");

      setSeconds(30);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="form-container">
      <h1>Verify OTP</h1>

      <form onSubmit={handleVerify} className="auth-form">
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button type="submit">Verify OTP</button>

        {seconds > 0 ? (
          <p className="otp-timer">
            Resend OTP in {seconds}s
          </p>
        ) : (
          <button
            type="button"
            className="resend-btn"
            onClick={resendOtp}
          >
            Resend OTP
          </button>
        )}
      </form>
    </div>
  );
}

export default VerifyOtp;