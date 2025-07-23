import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [order, setOrder] = useState(null);
    const [showShareModal, setShowShareModal] = useState(false);

    useEffect(() => {
        // Get order details from localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const currentOrder = orders.find(o => o.id === location.state?.orderId);
        if (currentOrder) {
            setOrder(currentOrder);
        } else {
            navigate('/order-history');
        }
    }, [location.state?.orderId, navigate]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleShare = () => {
        setShowShareModal(true);
    };

    const handleDownloadInvoice = () => {
        // Simulate invoice download
        alert('Invoice download started...');
    };

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="confirmation-card bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl mb-4">🎉</div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
                            <p className="text-gray-600">Thank you for your purchase</p>
                        </div>

                        <div className="order-details space-y-6">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID</span>
                                        <span className="font-medium">{order.id}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date</span>
                                        <span className="font-medium">{formatDate(order.date)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium">Card ending in {order.paymentDetails.last4}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total Amount</span>
                                        <span className="font-medium">${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shipping-details bg-gray-50 p-4 rounded-lg">
                                <h2 className="text-lg font-semibold mb-4">Shipping Details</h2>
                                <div className="space-y-2">
                                    <p className="font-medium">
                                        {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                                    </p>
                                    <p className="text-gray-600">{order.shippingDetails.address}</p>
                                    <p className="text-gray-600">
                                        {order.shippingDetails.city}, {order.shippingDetails.state} {order.shippingDetails.zipCode}
                                    </p>
                                    <p className="text-gray-600">{order.shippingDetails.country}</p>
                                </div>
                            </div>

                            <div className="order-items">
                                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-4">
                                            <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium">{item.name}</h3>
                                                <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                                <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="action-buttons mt-8 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <button 
                                onClick={handleDownloadInvoice}
                                className="download-invoice-btn"
                            >
                                Download Invoice
                            </button>
                            <button 
                                onClick={handleShare}
                                className="share-order-btn"
                            >
                                Share Order
                            </button>
                            <button 
                                onClick={() => navigate('/order-history')}
                                className="view-orders-btn"
                            >
                                View All Orders
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            {showShareModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Share Order</h3>
                        <p className="text-gray-600 mb-6">Share your order details with friends and family</p>
                        <div className="space-y-4">
                            <button className="share-option-btn">
                                <span className="text-2xl">📱</span>
                                <span className="ml-2">WhatsApp</span>
                            </button>
                            <button className="share-option-btn">
                                <span className="text-2xl">📧</span>
                                <span className="ml-2">Email</span>
                            </button>
                            <button className="share-option-btn">
                                <span className="text-2xl">📋</span>
                                <span className="ml-2">Copy Link</span>
                            </button>
                            <button 
                                onClick={() => setShowShareModal(false)}
                                className="cancel-share-btn"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderConfirmation; 