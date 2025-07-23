import { nav } from 'framer-motion/client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        email: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
        paymentMethod: 'creditCard',
        shippingSameAsBilling: true,
    });

    const [shippingData, setShippingData] = useState({
        name: '',
        contact: '',
        address: '',
        country: '',
        state: '',
        city: '',
        zip: '',
    });

    const [errors, setErrors] = useState({}); // State to store validation errors

    const [products] = useState([
        { id: 1, name: 'Industrial Drill', price: 3000, quantity: 1 },
        { id: 2, name: 'Steel Cutter', price: 1500, quantity: 2 },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        // Clear errors when user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleShippingInputChange = (e) => {
        const { name, value } = e.target;
        setShippingData((prevData) => ({ ...prevData, [name]: value }));
        // Clear errors when user starts typing
        setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Billing Details Validation
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email address';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.zip.trim()) newErrors.zip = 'ZIP/Postal code is required';
        if (!formData.country.trim()) newErrors.country = 'Country is required';
        if (!formData.state.trim()) newErrors.state = 'State is required';

        // Shipping Details Validation (if different from billing)
        if (!formData.shippingSameAsBilling) {
            if (!shippingData.name.trim()) newErrors.shippingName = 'Shipping name is required';
            if (!shippingData.contact.trim()) newErrors.shippingContact = 'Shipping contact is required';
            if (!shippingData.address.trim()) newErrors.shippingAddress = 'Shipping address is required';
            if (!shippingData.city.trim()) newErrors.shippingCity = 'Shipping city is required';
            if (!shippingData.zip.trim()) newErrors.shippingZip = 'Shipping ZIP/Postal code is required';
            if (!shippingData.country.trim()) newErrors.shippingCountry = 'Shipping country is required';
            if (!shippingData.state.trim()) newErrors.shippingState = 'Shipping state is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleCheckout = () => {
        const isValid = validateForm();
        if (isValid) {
            navigate('/Payment');
            // Add logic to proceed to payment gateway
        } else {
            alert('Please fix the errors before proceeding.');
        }
    };

    const calculateTotal = () => {
        return products.reduce((total, product) => total + product.price * product.quantity, 0);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <h1 className="text-2xl font-bold">Checkout</h1>

            {/* Billing Address Section */}
            <div className="p-6 rounded-3xl shadow-2xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Billing Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                        <div>
                            <input
                                name="contact"
                                placeholder="Contact Number"
                                value={formData.contact}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.contact ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact}</p>}
                        </div>
                        <div>
                            <input
                                name="email"
                                placeholder="Email Address"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <input
                                name="address"
                                placeholder="Street Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                        </div>
                        <div>
                            <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.city ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                            <input
                                name="zip"
                                placeholder="ZIP/Postal Code"
                                value={formData.zip}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.zip ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.zip && <p className="text-red-500 text-sm mt-1">{errors.zip}</p>}
                        </div>
                        <div>
                            <select
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.country ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select Country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="UK">UK</option>
                            </select>
                            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                        </div>
                        <div>
                            <select
                                name="state"
                                value={formData.state}
                                onChange={handleInputChange}
                                className={`w-full rounded-lg shadow-md p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Select State</option>
                                <option value="Gujarat">Gujarat</option>
                                <option value="Maharashtra">Maharashtra</option>
                                <option value="California">California</option>
                            </select>
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Address Section */}
            <div className="p-6 rounded-3xl shadow-2xl border border-gray-200">
                <div>
                    <div className="flex items-center mb-4">
                        <input
                            type="checkbox"
                            id="sameAsBilling"
                            checked={formData.shippingSameAsBilling}
                            onChange={() => setFormData({ ...formData, shippingSameAsBilling: !formData.shippingSameAsBilling })}
                            className="mr-2"
                        />
                        <label htmlFor="sameAsBilling">Shipping address same as billing</label>
                    </div>

                    {!formData.shippingSameAsBilling && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <input
                                        name="name"
                                        placeholder="Full Name"
                                        value={shippingData.name}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingName ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.shippingName && <p className="text-red-500 text-sm mt-1">{errors.shippingName}</p>}
                                </div>
                                <div>
                                    <input
                                        name="contact"
                                        placeholder="Contact Number"
                                        value={shippingData.contact}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingContact ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.shippingContact && <p className="text-red-500 text-sm mt-1">{errors.shippingContact}</p>}
                                </div>
                                <div>
                                    <input
                                        name="address"
                                        placeholder="Street Address"
                                        value={shippingData.address}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingAddress ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.shippingAddress && <p className="text-red-500 text-sm mt-1">{errors.shippingAddress}</p>}
                                </div>
                                <div>
                                    <input
                                        name="city"
                                        placeholder="City"
                                        value={shippingData.city}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingCity ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.shippingCity && <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>}
                                </div>
                                <div>
                                    <input
                                        name="zip"
                                        placeholder="ZIP/Postal Code"
                                        value={shippingData.zip}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingZip ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.shippingZip && <p className="text-red-500 text-sm mt-1">{errors.shippingZip}</p>}
                                </div>
                                <div>
                                    <select
                                        name="country"
                                        value={shippingData.country}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingCountry ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select Country</option>
                                        <option value="India">India</option>
                                        <option value="USA">USA</option>
                                        <option value="UK">UK</option>
                                    </select>
                                    {errors.shippingCountry && <p className="text-red-500 text-sm mt-1">{errors.shippingCountry}</p>}
                                </div>
                                <div>
                                    <select
                                        name="state"
                                        value={shippingData.state}
                                        onChange={handleShippingInputChange}
                                        className={`w-full rounded-lg shadow-md p-2 border ${errors.shippingState ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    >
                                        <option value="">Select State</option>
                                        <option value="Gujarat">Gujarat</option>
                                        <option value="Maharashtra">Maharashtra</option>
                                        <option value="California">California</option>
                                    </select>
                                    {errors.shippingState && <p className="text-red-500 text-sm mt-1">{errors.shippingState}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Payment Section */}
            <div className="p-6 rounded-3xl shadow-2xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                    <div className="space-y-2">
                        <div>
                            <input
                                type="radio"
                                id="creditCard"
                                name="paymentMethod"
                                value="creditCard"
                                checked={formData.paymentMethod === 'creditCard'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label htmlFor="creditCard">Credit Card</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="paypal"
                                name="paymentMethod"
                                value="paypal"
                                checked={formData.paymentMethod === 'paypal'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label htmlFor="paypal">PayPal</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id="cod"
                                name="paymentMethod"
                                value="cod"
                                checked={formData.paymentMethod === 'cod'}
                                onChange={handleInputChange}
                                className="mr-2"
                            />
                            <label htmlFor="cod">Cash on Delivery</label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Summary Section */}
            <div className="p-6 rounded-3xl shadow-2xl border border-gray-200">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-4">
                        {products.map((product) => (
                            <div key={product.id} className="flex justify-between">
                                <span>{product.name} (x{product.quantity})</span>
                                <span>₹{product.price * product.quantity}</span>
                            </div>
                        ))}
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>₹{calculateTotal()}</span>
                    </div>
                </div>
            </div>

            {/* Checkout Button */}
            <button
                className="w-full bg-blue-600 text-white py-3 rounded-3xl shadow-lg hover:bg-blue-700 transition-colors"
                onClick={handleCheckout}
            >
                Proceed to Checkout
            </button>
        </div>
    );
}

export default Checkout;