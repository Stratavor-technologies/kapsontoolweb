import React, { useState } from 'react';
import image from '../assets/Images/kapson-logo.png'
// import { div } from 'framer-motion/client';
import { useNavigate } from 'react-router-dom';

const ProductCart = () => {
    // Sample cart data - replace with your actual data source
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Heavy Duty Power Drill XR-5000",
            price: 299.99,
            quantity: 1,
            image: image
        },
        {
            id: 2,
            name: "Industrial Impact Wrench Pro",
            price: 189.50,
            quantity: 2,
            image: image
        },
        {
            id: 3,
            name: "Professional Angle Grinder 1800W",
            price: 149.99,
            quantity: 1,
            image: image
        }
    ]);

    // Cart operations
    const increaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        ));
    };

    const decreaseQuantity = (id) => {
        setCartItems(cartItems.map(item =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    // Calculate totals
    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08; // 8% tax rate
    const shipping = subtotal > 500 ? 0 : 25; // Free shipping over $500
    const total = subtotal + tax + shipping;

    // Custom SVG icons
    const IconCart = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"></circle>
            <circle cx="19" cy="21" r="1"></circle>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
        </svg>
    );

    const IconTrash = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
        </svg>
    );

    const IconPlus = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );

    const IconMinus = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
    );

    const IconArrowRight = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
    );

    const IconTool = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
        </svg>
    );

    return (
        <div className='bg-gray-50 py-16'>
            <div className=" rounded-lg shadow-lg overflow-hidden max-w-3xl  mx-auto transform transition-all duration-300 hover:scale-101 hover:shadow-xl">
                {/* Cart Header */}
                <div className="bg-blue-600  text-white p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <IconCart />
                        <h2 className="text-xl font-bold">Your Cart ({itemCount} items)</h2>
                    </div>
                    <div className="bg-yellow-500 text-blue-900 px-3 py-1 rounded-full text-sm font-bold">
                        Industrial Tools
                    </div>
                </div>

                {/* Cart Items */}
                <div className="divide-y divide-gray-200 bg-white">
                    {cartItems.length > 0 ? (
                        cartItems.map(item => {
                            const itemTotal = item.price * item.quantity;

                            return (
                                <div key={item.id} className="p-4 flex items-start space-x-4 hover:bg-gray-100 transition-colors">
                                    {/* Product Image */}
                                    <div className="relative w-24 h-24 flex-shrink-0 bg-gray-80 rounded-md overflow-hidden">
                                        <img src={item.image} alt={item.name} className="object-cover w-full h-full" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                                        <div className="flex items-center mt-1">
                                            <span className="text-blue-500 mr-1"><IconTool /></span>
                                            <span className="text-sm text-gray-500">Industrial Grade</span>
                                        </div>

                                        {/* Price and Controls */}
                                        <div className="flex flex-wrap items-center justify-between mt-3">
                                            <div className='flex gap-6 '>
                                                <div className="font-medium text-gray-700 pt-1">${item.price.toFixed(2)} × {item.quantity}</div>
                                                <p className='pt-1'>:</p>
                                                <div className="font-bold text-gray-900 mt-1">Total: ${itemTotal.toFixed(2)}</div>
                                            </div>

                                            <div className="flex items-center space-x-3 mt-2 sm:mt-0">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-300 rounded-md">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.id)}
                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-l-md"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <IconMinus />
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => increaseQuantity(item.id)}
                                                        className="p-1 text-gray-600 hover:bg-gray-100 rounded-r-md"
                                                    >
                                                        <IconPlus />
                                                    </button>
                                                </div>

                                                {/* Remove Button */}
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <IconTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            Your cart is empty
                        </div>
                    )}
                </div>

                {/* Cart Summary */}
                <div className="bg-gray-50 p-4">
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Tax (8%)</span>
                            <span>${tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg text-gray-900">
                            <span>Total</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-6 space-y-3">
                        <button onClick={() => navigate('/Checkout')} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors">
                            <span>Proceed to Checkout</span>
                            <span className="ml-2"><IconArrowRight /></span>
                        </button>

                        <button onClick={() => navigate('/Categorie')} className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors">
                            Continue Shopping
                        </button>
                    </div>

                    {/* Shipping Info */}
                    {subtotal > 0 && (
                        <div className="mt-4 text-center text-sm text-green-600 font-medium">
                            {subtotal < 500 ? (
                                <>Add ${(500 - subtotal).toFixed(2)} more to qualify for FREE shipping</>
                            ) : (
                                <>Your order qualifies for FREE shipping</>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCart;