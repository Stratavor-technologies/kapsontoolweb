import React, { useState } from "react";

const OrderTracking = () => {
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [ratings, setRatings] = useState({}); // Stores ratings for each order
    const [reviews, setReviews] = useState({}); // Stores reviews for each order

    const orders = [
        {
            id: 1,
            status: "Delivered",
            date: "2023-10-01",
            items: ["Drill Machine", "Safety Gloves", "Toolbox"],
            tracker: [
                { id: 1, name: "Ordered", date: "2023-10-01", completed: true },
                { id: 2, name: "Shipped", date: "2023-10-03", completed: true },
                { id: 3, name: "Out for Delivery", date: "2023-10-05", completed: true },
                { id: 4, name: "Delivered", date: "2023-10-06", completed: true },
            ],
        },
        {
            id: 2,
            status: "Delivered",
            date: "2023-09-25",
            items: ["Wrench Set", "Power Saw"],
            tracker: [
                { id: 1, name: "Ordered", date: "2023-09-20", completed: true },
                { id: 2, name: "Shipped", date: "2023-09-22", completed: true },
                { id: 3, name: "Out for Delivery", date: "2023-09-24", completed: true },
                { id: 4, name: "Delivered", date: "2023-09-25", completed: true },
            ],
        },
        {
            id: 3,
            status: "Processing",
            date: "2023-10-05",
            items: ["Industrial Hammer", "Measuring Tape"],
            tracker: [
                { id: 1, name: "Ordered", date: "2023-10-05", completed: true },
                { id: 2, name: "Shipped", date: "2023-10-07", completed: false },
                { id: 3, name: "Out for Delivery", date: "2023-10-09", completed: false },
                { id: 4, name: "Delivered", date: "2023-10-10", completed: false },
            ],
        },
    ];

    const toggleExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };

    const handleRatingChange = (orderId, rating, e) => {
        e.stopPropagation(); // Stop event propagation
        setRatings((prev) => ({ ...prev, [orderId]: rating }));
    };

    const handleReviewChange = (orderId, e) => {
        e.stopPropagation(); // Stop event propagation
        setReviews((prev) => ({ ...prev, [orderId]: e.target.value }));
    };

    const submitReview = (orderId, e) => {
        e.stopPropagation(); // Stop event propagation
        alert(`Review submitted for Order #${orderId}:\nRating: ${ratings[orderId]}\nReview: ${reviews[orderId]}`);
    };

    return (
        <div className="min-h-screen bg-gray-90 py-10 px-4">
            <h1 className="text-3xl font-bold text-center mb-8">
                Order Tracking
            </h1>
            <div className="max-w-4xl mx-auto space-y-6">
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="bg-gray-80 p-6 rounded-lg shadow-2xl transform transition-transform hover:scale-80 hover:shadow-3xl border-2 border-gray-700 cursor-pointer"
                        onClick={() => toggleExpand(order.id)}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">
                                Order #{order.id}
                            </h2>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "Shipped"
                                        ? "bg-blue-500 "
                                        : order.status === "Delivered"
                                            ? "bg-green-500 "
                                            : "bg-yellow-500 text-black"
                                    }`}
                            >
                                {order.status}
                            </span>
                        </div>
                        <p className=" mb-2">Order Date: {order.date}</p>
                        <div className="space-y-2">
                            <p className=" font-medium">Items:</p>
                            <ul className="list-disc list-inside ">
                                {order.items.map((item, index) => (
                                    <li key={index}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        {/* Order Tracker */}
                        {expandedOrderId === order.id && (
                            <div className="mt-6">
                                <div className="relative flex gap-8">
                                    {/* Progress line */}
                                    <div className="absolute left-4 top-4 h-[calc(100%-2rem)] w-1 bg-gray-70"></div>

                                    {/* Steps */}
                                    {order.tracker.map((step, index) => (
                                        <div key={step.id} className="flex items-start space-x-6 mb-8">
                                            {/* Step icon */}
                                            <div
                                                className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${step.completed ? "bg-green-500" : "bg-gray-700"
                                                    }`}
                                            >
                                                {step.completed ? (
                                                    <svg
                                                        className="w-4 h-4 text-white"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                ) : (
                                                    <span className="">{index + 1}</span>
                                                )}
                                            </div>

                                            {/* Step details */}
                                            <div className="flex-1">
                                                <h3
                                                    className={`text-lg font-semibold ${step.completed ? "text-green-500" : "text-gray-40"
                                                        }`}
                                                >
                                                    {step.name}
                                                </h3>
                                                <p className="text-gray-500">{step.date}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Rating and Review Section (for delivered orders) */}
                                {order.status === "Delivered" && (
                                    <div className="mt-6" onClick={(e) => e.stopPropagation()}>
                                        <h3 className="text-xl font-semibold  mb-4">
                                            Rate Your Order
                                        </h3>
                                        <div className="space-y-4">
                                            {/* Rating Stars */}
                                            <div className="flex items-center space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={(e) => handleRatingChange(order.id, star, e)}
                                                        className={`text-2xl ${ratings[order.id] >= star
                                                                ? "text-yellow-500"
                                                                : "text-gray-400"
                                                            }`}
                                                    >
                                                        ★
                                                    </button>
                                                ))}
                                            </div>

                                            {/* Review Textarea */}
                                            <textarea
                                                placeholder="Write your review..."
                                                value={reviews[order.id] || ""}
                                                onChange={(e) => handleReviewChange(order.id, e)}
                                                className="w-full p-2 rounded-lg border border-gray-400 "
                                                rows="4"
                                            />

                                            {/* Submit Button */}
                                            <button
                                                onClick={(e) => submitReview(order.id, e)}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTracking;