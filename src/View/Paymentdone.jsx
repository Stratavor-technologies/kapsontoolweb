import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PaymentConfirmation({ status = 'success', orderNumber = '123456789', amount = 6000 }) {
    const [countdown, setCountdown] = useState(10);
    const navigate = useNavigate();

    // Status can be 'success', 'processing', or 'rejected'
    const [paymentStatus, setPaymentStatus] = useState(status);

    useEffect(() => {
        // Simulate payment processing if status is set to processing
        if (paymentStatus === 'processing') {
            const timer = setTimeout(() => {
                // Randomly decide if payment succeeds or fails for demo purposes
                setPaymentStatus(Math.random() > 0.3 ? 'success' : 'rejected');
            }, 3000);

            return () => clearTimeout(timer);
        }

        // Countdown for redirection on success
        if (paymentStatus === 'success') {
            const interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [paymentStatus]);

    // Redirect to order history when countdown ends
    useEffect(() => {
        if (countdown === 0) {
            navigate('/Order');
        }
    }, [countdown, navigate]);

    const handleViewOrderHistory = () => {
        navigate('/Order');
    };

    const handleTryAgain = () => {
        setPaymentStatus('processing');
        setCountdown(10);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="p-8 rounded-3xl shadow-2xl border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300">
                {/* Status Icon */}
                <div className="flex justify-center mb-6">
                    {paymentStatus === 'success' && (
                        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                    {paymentStatus === 'processing' && (
                        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center shadow-lg animate-pulse">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    )}
                    {paymentStatus === 'rejected' && (
                        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    )}
                </div>

                {/* Status Title */}
                <h1 className="text-2xl font-bold text-center mb-2">
                    {paymentStatus === 'success' && 'Payment Successful!'}
                    {paymentStatus === 'processing' && 'Processing Payment...'}
                    {paymentStatus === 'rejected' && 'Payment Failed'}
                </h1>

                {/* Status Description */}
                <p className="text-gray-600 text-center mb-6">
                    {paymentStatus === 'success' && `Your order #${orderNumber} has been placed successfully.`}
                    {paymentStatus === 'processing' && 'Please wait while we process your payment.'}
                    {paymentStatus === 'rejected' && 'Your payment could not be processed. Please try again.'}
                </p>

                {/* Order Details (shown only on success or rejection) */}
                {paymentStatus !== 'processing' && (
                    <div className="bg-gray-50 p-6 rounded-2xl shadow-inner mb-6">
                        <h2 className="text-lg font-semibold mb-4">Order Details</h2>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Order Number:</span>
                                <span className="font-medium">{orderNumber}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Amount Paid:</span>
                                <span className="font-medium">₹{amount}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Payment Method:</span>
                                <span className="font-medium">Credit Card</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Date:</span>
                                <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col space-y-3">
                    {paymentStatus === 'success' && (
                        <>
                            <p className="text-center text-gray-600 mb-2">
                                You will be redirected to order history in {countdown} seconds
                            </p>
                            <button
                                onClick={handleViewOrderHistory}
                                className="w-full bg-blue-600 text-white py-3 rounded-3xl shadow-lg hover:bg-blue-700 transition-colors transform hover:translate-y-[-2px] hover:shadow-xl"
                            >
                                View Order History
                            </button>
                            <button
                                onClick={() => navigate('/Categoried')}
                                className="w-full bg-gray-100 text-gray-800 py-3 rounded-3xl shadow-md hover:bg-gray-200 transition-colors transform hover:translate-y-[-2px]"
                            >
                                Continue Shopping
                            </button>
                        </>
                    )}

                    {paymentStatus === 'rejected' && (
                        <>
                            <button
                                onClick={handleTryAgain}
                                className="w-full bg-blue-600 text-white py-3 rounded-3xl shadow-lg hover:bg-blue-700 transition-colors transform hover:translate-y-[-2px] hover:shadow-xl"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={handleViewOrderHistory}
                                className="w-full bg-gray-100 text-gray-800 py-3 rounded-3xl shadow-md hover:bg-gray-200 transition-colors transform hover:translate-y-[-2px]"
                            >
                                View Order History
                            </button>
                        </>
                    )}

                    {paymentStatus === 'processing' && (
                        <div className="flex justify-center">
                            <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentConfirmation;