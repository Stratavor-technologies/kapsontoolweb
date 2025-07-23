import React, { useState, useEffect } from 'react';
// import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import image from '../assets/Images/kapson-logo.png'
import image2 from '../assets/Images/kapson-logo.png'
import image3 from '../assets/Images/kapson-logo.png'
import CencelButton from '../assets/Images/kapson-logo.png'
// import { nav } from 'framer-motion/client';

const ProductView = () => {
    const { productId } = useParams();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isRotating, setIsRotating] = useState(false);
    const [rotationDegree, setRotationDegree] = useState(0);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate fetching product data by ID
        // In a real app, you would fetch from an API
        const fetchProductData = () => {
            // This is mock data - replace with your actual API call
            setTimeout(() => {
                // Mock product data (in a real app, this would come from your API)
                const mockProduct = {
                    id: parseInt(productId),
                    name: "Total 3pcs Hose quick Connectors Set",
                    sku: "THWS030301",
                    price: 188.00,
                    originalPrice: 250.67,
                    discount: "25%",
                    estimatedDelivery: "GET 18/03-23/03",
                    inStock: true,
                    breadcrumbs: ["Home", "Store", "Garden Tools"],
                    images: [
                        image,
                        image2,
                        image3
                    ],
                    details: {
                        upc: "8225928187412",
                        brand: "Total",
                        weight: "0.15 kg"
                    },
                    description: "Total 3pcs Hose quick Connectors Set THWS030301",
                    features: [
                        "Same as BLACK DECKER model and quality level",
                        "With 1pcs 1/2 plastic hose quick connector with water stop",
                        "With 1pcs 1/2 plastic hose quick connector",
                        "With 1pcs 1/2 tap Adapter with 3 / 4 tap adapter",
                        "Packed by plastic hanger"
                    ]
                };

                setProduct(mockProduct);
                setLoading(false);
            }, 500);
        };

        fetchProductData();
    }, [productId]);

    // Functions for 3D interaction
    const startRotation = () => {
        if (!isRotating) {
            setIsRotating(true);
        }
    };

    const stopRotation = () => {
        setIsRotating(false);
    };

    const handleMouseMove = (e) => {
        if (isRotating) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const centerX = rect.width / 2;
            const rotationValue = ((x - centerX) / centerX) * 30;
            setRotationDegree(rotationValue);
        }
    };

    const nextImage = () => {
        if (product) {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
        }
    };

    const prevImage = () => {
        if (product) {
            setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-8 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Product not found</h2>
                <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className='flex justify-end' onClick={() => window.history.back()}> <img src={CencelButton} alt="Cencel" srcset="" className='h-8' /></div>
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Side - Image Gallery */}
                <div className="lg:w-1/2">
                    <div
                        className="relative h-96 bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ease-in-out"
                        onMouseDown={startRotation}
                        onMouseUp={stopRotation}
                        onMouseLeave={stopRotation}
                        onMouseMove={handleMouseMove}
                    >
                        <div
                            className="h-full w-full flex items-center justify-center p-8 transition-all duration-300"
                            style={{ transform: `perspective(1000px) rotateY(${rotationDegree}deg)` }}
                        >
                            <img
                                src={product.images[currentImageIndex]}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain transform transition-transform hover:scale-110"
                            />
                        </div>

                        <button
                            onClick={prevImage}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:shadow-md"
                        >
                            {/* <ChevronLeft className="h-6 w-6 text-gray-700" /> */}
                            &#8249;
                        </button>

                        <button
                            onClick={nextImage}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-1 shadow hover:shadow-md"
                        >
                            {/* <ChevronRight className="h-6 w-6 text-gray-700" /> */}
                            &#8250;
                        </button>

                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {product.images.map((_, index) => (
                                <button
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${index === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Rest of the component remains unchanged */}
                    {/* Product details section */}
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-3">Product Details</h3>
                        <div className="space-y-2 text-sm text-gray-600">
                            <p><span className="font-medium">UPC:</span> {product.details.upc}</p>
                            <p><span className="font-medium">Brand:</span> {product.details.brand}</p>
                            <p><span className="font-medium">Weight:</span> {product.details.weight}</p>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">About this Item:</h3>
                            <p className="text-gray-600 mb-3">{product.description}</p>
                            <ul className="space-y-2">
                                {product.features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <span className="text-blue-500 mr-2">•</span>
                                        <span className="text-gray-600">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Right Side - Product Info */}
                <div className="lg:w-1/2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        {/* <nav className="flex text-sm text-gray-500 mb-4">
                            {product.breadcrumbs.map((item, index) => (
                                <React.Fragment key={index}>
                                    <span className="hover:text-blue-500 cursor-pointer">{item}</span>
                                    {index < product.breadcrumbs.length - 1 && <span className="mx-2">/</span>}
                                </React.Fragment>
                            ))}
                        </nav> */}

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
                        <p className="text-sm text-gray-500 mb-4">SKU: {product.sku}</p>

                        <div className="flex items-center mb-4">
                            <span className="text-2xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                            <div className="ml-4">
                                <span className="line-through text-gray-400 mr-2">${product.originalPrice.toFixed(2)}</span>
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">Save {product.discount}</span>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">{product.estimatedDelivery}</p>

                        <div className="mb-6">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {product.inStock ? 'In stock' : 'Out of stock'}
                            </span>
                        </div>

                        <button onClick={() => { navigate("/ProductCart") }} className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 px-6 rounded-md font-medium mb-4 transition-transform transform hover:scale-105">
                            Add to Cart
                        </button>

                        {/* <div className="flex justify-between items-center mb-8">
                            <p className="text-sm text-gray-600">Save this product for later</p>
                            <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded-md px-3 py-1">
                                {/* <Heart className="h-4 w-4" /> 
                                <span>Favorite</span>
                            </button>
                        </div> */}

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer reviews</h3>
                            <div className="flex items-center mb-4">
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full mr-2">
                                    ✓
                                </span>
                                <p className="text-sm text-gray-600">Reviews only from verified customers</p>
                            </div>

                            <p className="text-gray-600 text-sm mb-6">
                                No reviews yet. You can buy this product and be the first to leave a review.
                            </p>


                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Share this product with your friends</h3>
                                <div className="flex space-x-2">
                                    <button className="text-gray-500 hover:text-blue-600">
                                        {/* <Share2 className="h-5 w-5" /> */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="mt-8">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">You May Also Like</h2>
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="relative">
                                <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">On Sale</span>
                                <img src="/api/placeholder/200/200" alt="Related product" className="w-full h-48 object-contain mb-3" />
                            </div>
                            <h3 className="font-medium text-gray-800 mb-1 text-sm">Zigzag 1/2 Auto PNC Hose - ZTHP4020</h3>
                            <p className="text-xs text-gray-500 mb-2">SKU: ZTHP4020</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default ProductView;