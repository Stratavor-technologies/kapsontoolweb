import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequest } from "../Services/apiMethods";

const OrderTracking = () => {
  const { OrderID } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [review, setReview] = useState({
    rating: 0,
    comment: "",
    images: [],
  });

  const getOrder = async () => {
    const token = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await getRequest(`/orders/${OrderID}`, token);
      if (response.isSuccess && response.data) {
        setOrder(response.data);
      } else {
        setError("Could not fetch order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, [OrderID]);

  const trackingSteps = [
    {
      id: "PENDING",
      label: "Order Placed",
      description: "Your order has been placed successfully",
    },
    {
      id: "PROCESSING",
      label: "Processing",
      description: "We are preparing your order",
    },
    {
      id: "DISPATCHED",
      label: "Shipped",
      description: "Your order is on its way",
    },
    {
      id: "DELIVERED",
      label: "Delivered",
      description: "Your order has been delivered",
    },
  ];

  const getCurrentStepIndex = () => {
    switch (order?.status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "DISPATCHED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  const handleReviewSubmit = () => {
    if (!review.rating) {
      alert("Please select a rating");
      return;
    }

    // Here you would typically make an API call to submit the review
    // For now we'll just close the modal
    setShowReviewModal(false);

    // You could also update the local state to show the review immediately
    setOrder((prev) => ({
      ...prev,
      review: {
        ...review,
        date: new Date().toISOString(),
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Loading order details...
          </h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {error || "Order not found"}
          </h2>
          <button
            onClick={() => navigate("/order-history")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Order History
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Order Tracking
              </h1>
              <span className="text-lg font-semibold">Order #{order.id}</span>
            </div>

            {/* Tracking Timeline */}
            <div className="relative">
              <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200"></div>
              <div className="relative flex justify-between">
                {trackingSteps.map((step, index) => {
                  const isCompleted = index <= getCurrentStepIndex();
                  const isCurrent = index === getCurrentStepIndex();
                  const isDisabled =
                    order.status === "CANCELLED" && step.id !== "CANCELLED";

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
                                                    ${
                                                      isCompleted && !isDisabled
                                                        ? "bg-blue-600"
                                                        : "bg-gray-200"
                                                    }
                                                    ${
                                                      isCurrent
                                                        ? "ring-4 ring-blue-200"
                                                        : ""
                                                    }
                                                    ${
                                                      order.status ===
                                                      "CANCELLED"
                                                        ? "opacity-50"
                                                        : ""
                                                    }`}
                      >
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {isCompleted && !isDisabled ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                      <div className="text-center">
                        <p
                          className={`text-sm font-medium 
                                                    ${
                                                      isCompleted && !isDisabled
                                                        ? "text-blue-600"
                                                        : "text-gray-500"
                                                    }
                                                    ${
                                                      order.status ===
                                                      "CANCELLED"
                                                        ? "line-through opacity-50"
                                                        : ""
                                                    }`}
                        >
                          {step.label}
                        </p>
                        <p className="text-xs text-gray-500">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Status Banner */}
            {order.status === "CANCELLED" && (
              <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  <p className="text-red-700 font-medium">
                    This order has been cancelled
                  </p>
                </div>
              </div>
            )}

            {/* Order Details */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold mb-4">Order Details</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <img
                      src={item.productId.productImage[0]}
                      alt={item.productId.productName}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">
                        {item.productId.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Art.No: {item.productId.ArtNumber}
                      </p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                      <p className="text-sm font-medium">
                        ₹{item.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-medium">Total Amount:</span>
                  <span className="font-bold">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Info */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">{order.addressId.partyDetails.partyName}</p>
                <p className="text-gray-600">{order.addressId.partyDetails.email}</p>
                <p className="text-gray-600">{order.addressId.partyDetails.contactNo}</p>
              </div>
            </div>

            {/* Review Section */}
            {/* {order.status === "DELIVERED" && !order.review && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowReviewModal(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Leave a Review
                </button>
              </div>
            )} */}

            {order.review && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Your Review</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${
                          i < order.review.rating
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-700">{order.review.comment}</p>
                  {order.review.images?.length > 0 && (
                    <div className="mt-4 flex space-x-2">
                      {order.review.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Review ${index + 1}`}
                          className="w-20 h-20 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate("/order-history")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Back to Order History
          </button>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReview((prev) => ({ ...prev, rating: star }))
                    }
                    className="focus:outline-none"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= review.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comment
              </label>
              <textarea
                value={review.comment}
                onChange={(e) =>
                  setReview((prev) => ({ ...prev, comment: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="4"
                placeholder="Share your experience with this product..."
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleReviewSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTracking;
