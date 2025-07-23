import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getRequest, postRequest } from '../Services/apiMethods';

const Checkout = () => {
    // const { orderID } = useParams();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        paymentMethod: 'credit_card'
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const getOrder = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await getRequest("/carts/getCart/ByToken", token);
            setOrderDetails(response.data);
            
            // Pre-fill form with user data if available
            if (response.data && response.data.userId) {
                const user = response.data.userId;
                setFormData(prevState => ({
                    ...prevState,
                    firstName: user.firstName || '',
                    lastName: user.lastName || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    // You would add address fields here if they were available in the API response
                }));
            }
            
            // Set cart items from the order details
            if (response.data && response.data.items) {
                const totalPrice = response.data.totalAmount;
                const formattedItems = response.data.items.map(item => ({
                    id: item.productId._id,
                    name: item.productId.productName,
                    image: item.productId.productImage[0],
                    price: item.productId.basicPrice,
                    quantity: item.quantity,
                    totalPrice: item.price,
                    category: item.productId.category
                }));
                setCartItems(formattedItems);
                setTotalPrice(totalPrice);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        }
    };

    useEffect(() => {
        getOrder();
    }, []);

    useEffect(() => {
        // Fetch categories on mount
        const fetchCategories = async () => {
            try {
                const response = await getRequest("/categories");
                if (response.isSuccess && response.items) {
                    setCategories(response.items);
                }
            } catch (error) {
                // handle error
            }
        };
        fetchCategories();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            newErrors.phone = 'Phone number is invalid';
        }
        
        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        if (!formData.zipCode.trim()) {
            newErrors.zipCode = 'ZIP code is required';
        } else if (!/^\d{5,10}$/.test(formData.zipCode)) {
            newErrors.zipCode = 'ZIP code is invalid';
        }
        
        if (!formData.country.trim()) {
            newErrors.country = 'Country is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            // 1. Proceed to checkout
            const proceedResponse = await postRequest(
                `/orders/proceedToCheckout/${orderDetails._id}`,
                {}, // payload if needed
                token
            );
            if (!proceedResponse || !proceedResponse.isSuccess) {
                alert('Failed to proceed to checkout');
                setIsLoading(false);
                return;
            }
            const orderId = proceedResponse.data._id;

            // 2. Place order
            const paymentPayload = {
                partyDetails: {
                    partyName: `${formData.firstName} ${formData.lastName}`,
                    contactNo: formData.phone,
                    email: formData.email,
                    address: formData.address
                },
                country: formData.country,
                state: formData.state,
                city: formData.city,
                zipCode: formData.zipCode,
                orderId: orderId,
                paymentMethod: formData.paymentMethod
            };

            const placeOrderResponse = await postRequest(
                `/orders/placeOrder/${orderId}`,
                paymentPayload,
                token
            );

            if (formData.paymentMethod === 'cash_on_delivery') {
                alert('Cash on Delivery order placed successfully!');
                navigate('/order-history');
                return;
            }

            if (placeOrderResponse && placeOrderResponse.isSuccess) {
                navigate('/payment', { state: { paymentId: placeOrderResponse.data.id } });
            } else {
                alert('Error placing your order. Please try again.');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            alert('Error processing your order. Please try again.');
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) =>  (item.totalPrice || 0), 0);
    };

    const calculateTotal = () => {
        return calculateSubtotal() ;
    };

    const getCategoryName = (categoryId) => {
        const cat = categories.find((c) => c.id === categoryId || c._id === categoryId);
        return cat ? cat.name : "Unknown Category";
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="checkout-card bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Shipping Information */}
                            <div className="shipping-info">
                                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                                First Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.firstName 
                                                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:border-blue-500'
                                                }`}
                                                placeholder="Enter your first name"
                                            />
                                            {errors.firstName && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.firstName}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                                Last Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.lastName 
                                                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:border-blue-500'
                                                }`}
                                                placeholder="Enter your last name"
                                            />
                                            {errors.lastName && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                errors.email 
                                                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            placeholder="Enter your email address"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <span className="mr-1">⚠</span>
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                errors.phone 
                                                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            placeholder="Enter your phone number"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <span className="mr-1">⚠</span>
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                errors.address 
                                                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            placeholder="Enter your full address"
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <span className="mr-1">⚠</span>
                                                {errors.address}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.city 
                                                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:border-blue-500'
                                                }`}
                                                placeholder="City"
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.city}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.state 
                                                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:border-blue-500'
                                                }`}
                                                placeholder="State"
                                            />
                                            {errors.state && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.state}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="zipCode"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                    errors.zipCode 
                                                        ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                        : 'border-gray-300 focus:border-blue-500'
                                                }`}
                                                placeholder="ZIP Code"
                                            />
                                            {errors.zipCode && (
                                                <p className="mt-1 text-sm text-red-600 flex items-center">
                                                    <span className="mr-1">⚠</span>
                                                    {errors.zipCode}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                                            Country <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={formData.country}
                                            onChange={handleChange}
                                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                                                errors.country 
                                                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                                                    : 'border-gray-300 focus:border-blue-500'
                                            }`}
                                            placeholder="Enter your country"
                                        />
                                        {errors.country && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <span className="mr-1">⚠</span>
                                                {errors.country}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-3">
                                            Payment Method <span className="text-red-500">*</span>
                                        </label>
                                        <div className="space-y-3">
                                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="credit_card"
                                                    checked={formData.paymentMethod === 'credit_card'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-3 text-gray-700 font-medium">Credit Card</span>
                                            </label>
                                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="debit_card"
                                                    checked={formData.paymentMethod === 'debit_card'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-3 text-gray-700 font-medium">Debit Card</span>
                                            </label>
                                            <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cash_on_delivery"
                                                    checked={formData.paymentMethod === 'cash_on_delivery'}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                                />
                                                <span className="ml-3 text-gray-700 font-medium">Cash on Delivery</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                                            isLoading 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                                        }`}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            formData.paymentMethod === 'cash_on_delivery' 
                                                ? 'Confirm Cash on Delivery Order' 
                                                : 'Proceed to Payment'
                                        )}
                                    </button>
                                </form>
                            </div>

                            {/* Order Summary */}
                            <div className="order-summary">
                                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
                                <div className="bg-gray-50 rounded-lg p-6">
                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
                                                <div className="flex items-center space-x-4">
                                                    <img 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <div>
                                                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                                                        <p className="text-xs text-gray-500">
                                                            Category: {getCategoryName(item.category)}
                                                        </p>
                                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-medium text-gray-900">₹{(item.totalPrice ? item.totalPrice.toFixed(2) : "0.00")}</p>
                                            </div>
                                        ))}
                                        
                                        <div className="border-t pt-4 mt-4">
                                            <div className="flex justify-between text-lg font-bold text-gray-900">
                                                <span>Total</span>
                                                <span>₹{totalPrice}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;