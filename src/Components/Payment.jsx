import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Payment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [paymentData, setPaymentData] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        saveCard: false
    });
    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        // Get order details from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const currentOrder = orders.find(o => o.id === location.state?.orderId);
        if (currentOrder) {
            setOrder(currentOrder);
        } else {
            navigate('/cart');
        }
    }, [location.state?.orderId, navigate]);

    const validateForm = () => {
        const newErrors = {};
        
        if (!paymentData.cardNumber.trim()) {
            newErrors.cardNumber = 'Card number is required';
        } else if (!/^\d{16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Invalid card number';
        }
        
        if (!paymentData.cardName.trim()) {
            newErrors.cardName = 'Cardholder name is required';
        }
        
        if (!paymentData.expiryDate.trim()) {
            newErrors.expiryDate = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(paymentData.expiryDate)) {
            newErrors.expiryDate = 'Invalid expiry date (MM/YY)';
        }
        
        if (!paymentData.cvv.trim()) {
            newErrors.cvv = 'CVV is required';
        } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
            newErrors.cvv = 'Invalid CVV';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsProcessing(true);

        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Update order status
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            const updatedOrders = orders.map(o => {
                if (o.id === order.id) {
                    return {
                        ...o,
                        status: 'paid',
                        paymentDetails: {
                            method: 'card',
                            last4: paymentData.cardNumber.slice(-4),
                            date: new Date().toISOString()
                        }
                    };
                }
                return o;
            });

            localStorage.setItem('orders', JSON.stringify(updatedOrders));

            // Navigate to order confirmation
            navigate('/order-confirmation', { state: { orderId: order.id } });
        } catch (error) {
            console.error('Payment processing error:', error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setPaymentData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancel = () => {
        // Update order status to cancelled
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.map(o => {
            if (o.id === order.id) {
                return {
                    ...o,
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString()
                };
            }
            return o;
        });

        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        navigate('/order-history');
    };

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="payment-card bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment Details</h1>
                        
                        <div className="order-summary mb-8 p-4 bg-gray-50 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order ID</span>
                                    <span className="font-medium">{order.id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total Amount</span>
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                                    Card Number *
                                </label>
                                <input
                                    type="text"
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={paymentData.cardNumber}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012 3456"
                                    className={`input-field ${errors.cardNumber ? 'border-red-500' : ''}`}
                                />
                                {errors.cardNumber && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                                    Cardholder Name *
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    name="cardName"
                                    value={paymentData.cardName}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className={`input-field ${errors.cardName ? 'border-red-500' : ''}`}
                                />
                                {errors.cardName && (
                                    <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                                        Expiry Date *
                                    </label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        name="expiryDate"
                                        value={paymentData.expiryDate}
                                        onChange={handleChange}
                                        placeholder="MM/YY"
                                        className={`input-field ${errors.expiryDate ? 'border-red-500' : ''}`}
                                    />
                                    {errors.expiryDate && (
                                        <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                                        CVV *
                                    </label>
                                    <input
                                        type="text"
                                        id="cvv"
                                        name="cvv"
                                        value={paymentData.cvv}
                                        onChange={handleChange}
                                        placeholder="123"
                                        className={`input-field ${errors.cvv ? 'border-red-500' : ''}`}
                                    />
                                    {errors.cvv && (
                                        <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="saveCard"
                                    name="saveCard"
                                    checked={paymentData.saveCard}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="saveCard" className="ml-2 block text-sm text-gray-700">
                                    Save card for future payments
                                </label>
                            </div>

                            <div className="flex justify-between space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="border-2 border-red-600 text-red-600 font-semibold py-2 px-4 rounded-lg hover:bg-red-600 hover:text-white transition duration-300"
                                >
                                    Cancel Payment
                                </button>
                                <button
                                    type="submit"
                                    className="border-2 border-blue-600 text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 hover:text-white transition duration-300"
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? 'Processing...' : 'Pay Now'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Cancel Payment</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to cancel this payment? Your order will be cancelled.</p>
                        <div className="flex justify-end space-x-4">
                            <button 
                                onClick={() => setShowCancelModal(false)}
                                className="cancel-btn"
                            >
                                No, Continue
                            </button>
                            <button 
                                onClick={confirmCancel}
                                className="confirm-btn"
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Payment; 