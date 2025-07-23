import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../Services/axios';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Validation functions
    const validateEmail = (email) => {
        const errors = [];
        
        if (!email.trim()) {
            errors.push('Email address is required');
        } else {
            // More comprehensive email regex
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            
            if (!emailRegex.test(email)) {
                errors.push('Please enter a valid email address');
            }
            
            if (email.length > 254) {
                errors.push('Email address is too long');
            }
        }
        
        return errors;
    };

    const validateOTP = (otp) => {
        const errors = [];
        
        if (!otp.trim()) {
            errors.push('Verification code is required');
        } else {
            // Remove any spaces and check if it's numeric
            const cleanOtp = otp.replace(/\s/g, '');
            
            if (!/^\d+$/.test(cleanOtp)) {
                errors.push('Verification code must contain only numbers');
            }
            
            if (cleanOtp.length < 4 || cleanOtp.length > 8) {
                errors.push('Verification code must be between 4-8 digits');
            }
        }
        
        return errors;
    };

    const validatePassword = (password) => {
        const errors = [];
        
        if (!password) {
            errors.push('Password is required');
        } else {
            if (password.length < 8) {
                errors.push('Password must be at least 8 characters long');
            }
            
            if (password.length > 128) {
                errors.push('Password must not exceed 128 characters');
            }
            
            // Check for at least one lowercase letter
            if (!/[a-z]/.test(password)) {
                errors.push('Password must contain at least one lowercase letter');
            }
            
            // Check for at least one uppercase letter
            if (!/[A-Z]/.test(password)) {
                errors.push('Password must contain at least one uppercase letter');
            }
            
            // Check for at least one digit
            if (!/\d/.test(password)) {
                errors.push('Password must contain at least one number');
            }
            
            // Check for at least one special character
            if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
                errors.push('Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)');
            }
            
            // Check for common weak patterns
            const commonPatterns = [
                /123456/,
                /password/i,
                /qwerty/i,
                /abc123/i,
                /(.)\1{2,}/  // Same character repeated 3+ times
            ];
            
            if (commonPatterns.some(pattern => pattern.test(password))) {
                errors.push('Password contains common patterns and is not secure');
            }
        }
        
        return errors;
    };

    const validatePasswordMatch = (password, confirmPassword) => {
        const errors = [];
        
        if (!confirmPassword) {
            errors.push('Please confirm your password');
        } else if (password !== confirmPassword) {
            errors.push('Passwords do not match');
        }
        
        return errors;
    };

    // Real-time validation
    const validateField = (fieldName, value) => {
        let fieldErrors = [];
        
        switch (fieldName) {
            case 'email':
                fieldErrors = validateEmail(value);
                break;
            case 'otp':
                fieldErrors = validateOTP(value);
                break;
            case 'newPassword':
                fieldErrors = validatePassword(value);
                break;
            case 'confirmPassword':
                fieldErrors = validatePasswordMatch(formData.newPassword, value);
                break;
            default:
                break;
        }
        
        setErrors(prev => ({
            ...prev,
            [fieldName]: fieldErrors.length > 0 ? fieldErrors : undefined
        }));
        
        return fieldErrors.length === 0;
    };

    // Form validation for each step
    const validateStep = () => {
        let isValid = true;
        let stepErrors = {};
        
        if (step === 1) {
            const emailErrors = validateEmail(formData.email);
            if (emailErrors.length > 0) {
                stepErrors.email = emailErrors;
                isValid = false;
            }
        } else if (step === 2) {
            const otpErrors = validateOTP(formData.otp);
            if (otpErrors.length > 0) {
                stepErrors.otp = otpErrors;
                isValid = false;
            }
        } else if (step === 3) {
            const passwordErrors = validatePassword(formData.newPassword);
            const confirmPasswordErrors = validatePasswordMatch(formData.newPassword, formData.confirmPassword);
            
            if (passwordErrors.length > 0) {
                stepErrors.newPassword = passwordErrors;
                isValid = false;
            }
            
            if (confirmPasswordErrors.length > 0) {
                stepErrors.confirmPassword = confirmPasswordErrors;
                isValid = false;
            }
        }
        
        setErrors(stepErrors);
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate current step
        if (!validateStep()) {
            setIsLoading(false);
            return;
        }

        try {
            if (step === 1) {
                // Send OTP request
                const response = await axiosInstance.post('/auths/forgotPassword', { 
                    username: formData.email.trim(), 
                    verificationType: "password",
                    authMethod: "email",
                    deviceType: "web"
                });
                
                console.log(response.data);
                
                if (response.data && response.data.data.id) {
                    localStorage.setItem('userId', response.data.data.id || '');
                    localStorage.setItem('username', response.data.data.fullName || '');
                }
                setStep(2);
                
            } else if (step === 2) {
                // Verify OTP
                await axiosInstance.post('/auths/verifyOTP', {
                    userId: localStorage.getItem('userId'),
                    activationCode: formData.otp.replace(/\s/g, ''), // Remove spaces
                    deviceType: "web"
                });
                setStep(3);
                
            } else if (step === 3) {
                // Reset password
                await axiosInstance.put(`/auths/resetPassword?userId=${localStorage.getItem('userId')}`, {
                    password: formData.newPassword
                });
                
                // Clear the userId from localStorage after successful password reset
                localStorage.removeItem('userId');
                localStorage.removeItem('username');
                navigate('/login');
            }
        } catch (error) {
            console.error('Error:', error);
            
            // Handle specific API errors
            const apiMessage = error.response?.data?.message || 'An error occurred. Please try again.';
            
            if (step === 1) {
                setErrors({ email: [apiMessage] });
            } else if (step === 2) {
                setErrors({ otp: [apiMessage] });
            } else if (step === 3) {
                setErrors({ general: [apiMessage] });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear errors for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        validateField(name, value);
    };

    // Helper function to render field errors
    const renderFieldErrors = (fieldName) => {
        if (!errors[fieldName]) return null;
        
        return (
            <div className="mt-1 text-sm text-red-600">
                {errors[fieldName].map((error, index) => (
                    <div key={index} className="flex items-start">
                        <span className="text-red-500 mr-1">•</span>
                        <span>{error}</span>
                    </div>
                ))}
            </div>
        );
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let score = 0;
        const checks = [
            password.length >= 8,
            /[a-z]/.test(password),
            /[A-Z]/.test(password),
            /\d/.test(password),
            /[!@#$%^&*(),.?":{}|<>]/.test(password),
            password.length >= 12
        ];
        
        score = checks.filter(Boolean).length;
        
        if (score <= 2) return { strength: score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 4) return { strength: score, label: 'Medium', color: 'bg-yellow-500' };
        return { strength: score, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <div className="text-6xl mb-4">🔑</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
                    <p className="text-gray-600">
                        {step === 1 && 'Enter your email to receive a verification code'}
                        {step === 2 && 'Enter the verification code sent to your email'}
                        {step === 3 && 'Set your new password'}
                    </p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="forgot-password-card bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                                {errors.general.map((error, index) => (
                                    <div key={index}>{error}</div>
                                ))}
                            </div>
                        )}

                        {step === 1 && (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="Enter your email"
                                        disabled={isLoading}
                                    />
                                    {renderFieldErrors('email')}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div>
                                <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                    Verification Code *
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        required
                                        value={formData.otp}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={`input-field ${errors.otp ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                        placeholder="Enter the verification code"
                                        disabled={isLoading}
                                        maxLength="8"
                                    />
                                    {renderFieldErrors('otp')}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    Check your email for the verification code. It may take a few minutes to arrive.
                                </p>
                            </div>
                        )}

                        {step === 3 && (
                            <>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                                        New Password *
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={showNewPassword ? "text" : "password"}
                                            required
                                            value={formData.newPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`input-field pr-10 ${errors.newPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder="Enter new password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showNewPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password strength indicator */}
                                    {formData.newPassword && (
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-gray-600">Password strength:</span>
                                                <span className={`text-sm font-medium ${
                                                    passwordStrength.label === 'Weak' ? 'text-red-600' :
                                                    passwordStrength.label === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                                }`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                                                    style={{ width: `${(passwordStrength.strength / 6) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {renderFieldErrors('newPassword')}
                                </div>
                                
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                        Confirm New Password *
                                    </label>
                                    <div className="mt-1 relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            required
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}`}
                                            placeholder="Confirm new password"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {renderFieldErrors('confirmPassword')}
                                </div>
                            </>
                        )}

                        <div>
                            <button 
                                type="submit" 
                                className="reset-password-button"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : step === 1 ? 'Send Code' : step === 2 ? 'Verify Code' : 'Reset Password'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <Link to="/login" className="back-to-login-link">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;