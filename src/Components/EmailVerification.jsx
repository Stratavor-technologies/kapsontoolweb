import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postRequest } from "../Services/apiMethods";

const EmailVerification = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    // Check if the pasted value is exactly 4 digits
    if (value.length === 4 && /^\d+$/.test(value)) {
      const newOtp = value.split(''); // Split the pasted string into an array of digits
      setOtp(newOtp);

      // Focus the last input after pasting
      const lastInput = document.querySelector(`input[name=otp-3]`);
      if (lastInput) {
        // Use setTimeout to ensure the state update has rendered before focusing
        setTimeout(() => lastInput.focus(), 0);
      }
    } else if (value.length === 1 && /^\d*$/.test(value)) { // Allow only single digits or empty string
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Auto-focus next input only if a digit was entered
      if (value && index < 3) {
        const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
        if (nextInput) nextInput.focus();
      }
    }
    // Ignore inputs that are not single digits or a 4-digit paste
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      const prevInput = document.querySelector(`input[name=otp-${index - 1}]`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 3) { // Changed 5 to 3
      const nextInput = document.querySelector(`input[name=otp-${index + 1}]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");

      const payload = {
        userId: userId,
        deviceType: "web",
        authMethod: "email",
      };
      await postRequest("/auths/resendOtp", payload);
      setTimer(60);
      setCanResend(false);
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 4) {
      setError("Please enter a valid 4-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      const response = await axios.post(
        `${import.meta.env.VITE_API_KEY}/auths/verifyOTP`,
        {
          userId: userId,
          activationCode: otpValue,
          deviceType: "web",
        }
      );

      if (response.data) {
        localStorage.setItem(
          "token",
          response.data.data.session.accessToken || ""
        );
        navigate("/");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">✉️</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Verify Your Email
          </h2>
          <p className="text-gray-600">
            We've sent a verification code to your email address
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex justify-center space-x-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                  autoComplete="one-time-code"
                  inputMode="numeric"
                />
              ))}
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || isLoading}
                  className={`text-blue-600 hover:text-blue-800 ${
                    !canResend ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                </button>
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                disabled={isLoading || otp.join("").length !== 4}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
