import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartItems, removeFromCartAPI, updateCartItemQuantity } from '../store/cartSlice';
import {
  getRequest,
  deleteRequest,
  putRequest,
  postRequest,
} from "../Services/apiMethods";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartData, status } = useSelector((state) => state.cart);
  const [showRemoveConfirmation, setShowRemoveConfirmation] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(null);

  console.log("Cart Component - cartData:", cartData); // Debug log
  console.log("Cart Component - status:", status); // Debug log

  useEffect(() => {
    console.log("Cart Component - useEffect triggered"); // Debug log
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCartItems());
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    setIsUpdating(itemId);
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found in localStorage");
      setIsUpdating(null);
      return;
    }

    const itemToUpdate = cartData.items.find((item) => item._id === itemId);
    if (!itemToUpdate || !itemToUpdate.productId) {
      console.error("Item or productId not found");
      setIsUpdating(null);
      return;
    }

    const payload = {
      items: [
        {
          productId: itemToUpdate.productId._id,
          quantity: newQuantity,
        },
      ],
    };

    try {
      await dispatch(updateCartItemQuantity({ 
        cartId: cartData._id, 
        items: payload.items 
      })).unwrap();
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const removeItem = (item) => {
    setItemToRemove(item);
    setShowRemoveConfirmation(true);
  };

  const confirmRemove = async () => {
    setIsLoading(true);
    try {
      await dispatch(removeFromCartAPI({
        cartId: cartData._id,
        productId: itemToRemove.productId._id,
        quantity: itemToRemove.quantity
      })).unwrap();
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsLoading(false);
      setShowRemoveConfirmation(false);
      setItemToRemove(null);
    }
  };

  const cancelRemove = () => {
    setShowRemoveConfirmation(false);
    setItemToRemove(null);
  };

  // Calculate total with GST included
  const calculateTotal = () => {
    if (!cartData || !cartData.items) return 0;

    return cartData.items.reduce((total, item) => {
      const gstPercentage = item.productId.hsnNumber?.gstPercentage || 18;
      const itemPrice = item.productId.basicPrice * item.quantity;
      const withGST = itemPrice + itemPrice;
      return total + withGST;
    }, 0);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cartData || !cartData.items || cartData.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 mt-[100px] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 text-center">
            <div className="text-4xl sm:text-6xl mb-4">🛒</div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <button
              onClick={() => navigate("/categories")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 mt-[90px] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
              Shopping Cart
            </h1>

            {/* Cart Items */}
            <div className="space-y-4 sm:space-y-6">
              {cartData.items.map((item) => {
                const gstPercentage =
                  item.productId.hsnNumber?.gstPercentage || 18;
                const basicPrice = item.productId.basicPrice;
                const quantity = item.quantity;
                const itemSubtotal = basicPrice * quantity;
                const gstAmount = (itemSubtotal * gstPercentage) / 100;
                const itemTotal = itemSubtotal + gstAmount;

                return (
                  <div
                    key={item._id}
                    className="border-b pb-4 sm:pb-6 last:border-b-0 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      {item.productId &&
                      item.productId.productImage &&
                      item.productId.productImage.length > 0 ? (
                        <img
                          src={item.productId.productImage[0]}
                          alt={item.productId.productName}
                          className="w-full sm:w-24 h-48 sm:h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4"
                        />
                      ) : (
                        <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-200 rounded-lg mb-4 sm:mb-0 sm:mr-4 flex items-center justify-center">
                          <span className="text-gray-400">No image</span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {item.productId
                            ? item.productId.productName
                            : "Product Name Unavailable"}
                        </h3>
                        <div className="text-gray-600 mt-1">
                          <div>Base Price: ₹{basicPrice.toFixed(2)}</div>
                          <div>
                            GST ({gstPercentage}%): ₹
                            {((basicPrice * gstPercentage) / 100).toFixed(2)}
                          </div>
                          <div className="font-medium">
                            Price per item: ₹
                            {(
                              basicPrice +
                              (basicPrice * gstPercentage) / 100
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 sm:mt-0">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors disabled:opacity-50"
                            disabled={isUpdating === item._id}
                          >
                            -
                          </button>
                          <span className="text-lg font-medium">
                            {isUpdating === item._id ? "..." : item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors disabled:opacity-50"
                            disabled={isUpdating === item._id}
                          >
                            +
                          </button>
                        </div>
                        <div className="flex flex-col items-end ml-6 sm:ml-8">
                          <div className="font-bold">
                            ₹{itemTotal.toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeItem(item)}
                            className="text-red-500 hover:text-red-600 transition-colors disabled:opacity-50 mt-2"
                            disabled={isUpdating === item._id}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 sm:mt-8 border-t pt-6 sm:pt-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 sm:space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{cartData.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total (including GST)</span>
                  <span> ₹{cartData.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-4">
              <button
                onClick={() => navigate("/categories")}
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Remove Confirmation Modal */}
      {showRemoveConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Remove Item</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this item from your cart?
            </p>
            <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
              <button
                onClick={cancelRemove}
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmRemove}
                className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
