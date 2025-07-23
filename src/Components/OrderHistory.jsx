import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRequest } from "../Services/apiMethods";

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrderHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if token is not present
      return;
    }

    setLoading(true);
    try {
      const response = await getRequest("/orders", token);
    //   console.log("Order History:", response);

      if (response.isSuccess && response.items) {
        // Transform API data to match the expected structure in the component
        const formattedOrders = response.items.map((order) => ({
          id: order.id,
          orderNumber: order.orderNumber || order.id.slice(-6),
          date: order.createdAt,
          status: order.status?.toLowerCase() || "pending",
          total: order.totalAmount,
          items: order.items.map((item) => ({
            id: item.id || Math.random().toString(36).substr(2, 9),
            name: item.productName || item.name || "Product",
            quantity: item.quantity || 1,
            price: item.price || order.totalAmount / (item.quantity || 1),
            image: item.image || item.imgUrl || "/api/placeholder/100/100",
          })),
          shippingDetails: {
            firstName:
              order.userId?.firstName ||
              order.addressId?.partyDetails?.firstName ||
              "",
            lastName:
              order.userId?.lastName ||
              order.addressId?.partyDetails?.lastName ||
              "",
            address: order.addressId
              ? `${order.addressId.addressLine1 || ""}, ${
                  order.addressId.city || ""
                }, ${order.addressId.state || ""}`
              : "Address information not available",
          },
        }));

        setOrders(formattedOrders);
      } else {
        setError("Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
      setError("Error fetching order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrderHistory();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredOrders = orders
    .filter((order) => filterStatus === "all" || order.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      } else if (sortBy === "price") {
        return b.total - a.total;
      }
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Order History
              </h1>
              <div className="flex space-x-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Orders</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm px-4 py-2 bg-white focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date">Sort by Date</option>
                  <option value="price">Sort by Price</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Error Loading Orders
                </h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                  onClick={getOrderHistory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📦</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  No Orders Found
                </h2>
                <p className="text-gray-600 mb-8">
                  You haven't placed any orders yet.
                </p>
                <button
                  onClick={() => navigate("/categories")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order.orderNumber || order.id.slice(-6)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.date)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center space-x-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "/api/placeholder/100/100";
                            }}
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-sm font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">
                            {order.shippingDetails.firstName}{" "}
                            {order.shippingDetails.lastName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.shippingDetails.address}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-lg font-bold text-gray-900">
                            ${order.total.toFixed(2)}
                          </p>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => navigate(`/order-tracking/${order.id}`)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                            >
                              Track Order
                            </button>
                            {/* <button
                              onClick={() =>
                                navigate("/order-confirmation", {
                                  state: { orderId: order.id },
                                })
                              }
                              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                            >
                              View Details
                            </button> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
