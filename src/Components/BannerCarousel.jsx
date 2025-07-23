import React, { useState, useEffect } from 'react';
import banner1 from '../assets/Images/Bannner1.webp'; // Fallback images
import banner2 from '../assets/Images/Banner2.avif';
import banner3 from '../assets/Images/Banner3.jpg';
import { getRequest } from '../Services/apiMethods';

const BannerCarousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getBanners = async () => {
        try {
            setLoading(true);
            const response = await getRequest('/banners?type=web&palcemnt=homepage');
            // console.log('Banners:', response);
            
            if (response.isSuccess && response.items && response.items.length > 0) {
                // Format the API data to match our banner structure
                const formattedBanners = response.items.map(item => ({
                    id: item.id,
                    image: item.imageUrl,
                    title: item.titleBanner || "Special Offer",
                    description: item.description || "Check out our latest products",
                    status: item.status
                }));
                
                // Filter only active banners
                const activeBanners = formattedBanners.filter(banner => banner.status === "active");
                
                if (activeBanners.length > 0) {
                    setBanners(activeBanners);
                } else {
                    // Fallback to default banners if no active banners from API
                    setBanners(defaultBanners);
                }
            } else {
                // Use default banners if API returns empty array
                setBanners(defaultBanners);
            }
        }
        catch (error) {
            console.error('Error fetching banners:', error);
            setError('Failed to load banners');
            setBanners(defaultBanners); // Use fallback banners on error
        }
        finally {
            setLoading(false);
        }
    };

    // Default banners as fallback
    const defaultBanners = [
        {
            id: 1,
            image: banner1,
            title: "Professional Power Tools",
            description: "Discover our wide range of high-quality power tools"
        },
        {
            id: 2,
            image: banner2,
            title: "Special Offers",
            description: "Get up to 30% off on selected items"
        },
        {
            id: 3,
            image: banner3,
            title: "New Arrivals",
            description: "Check out our latest collection of tools"
        }
    ];

    useEffect(() => {
        getBanners();
    }, []);

    useEffect(() => {
        let interval;
        // Only auto-play if there's more than one banner
        if (isAutoPlaying && banners.length > 1) {
            interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 3000); // Change slide every 3 seconds
        }
        return () => clearInterval(interval);
    }, [isAutoPlaying, banners.length]);

    const nextSlide = () => {
        if (banners.length > 1) {
            setCurrentSlide((prev) => (prev + 1) % banners.length);
        }
    };

    const prevSlide = () => {
        if (banners.length > 1) {
            setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
        }
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
    };

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center bg-gray-200">Loading banners...</div>;
    }

    if (error) {
        return <div className="w-full h-screen flex items-center justify-center bg-gray-200">{error}</div>;
    }

    return (
        <div 
            className="relative w-full h-screen overflow-hidden shadow-2xl"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
        >
            {/* Main Carousel */}
            <div 
                className={`relative w-full h-full ${banners.length > 1 ? 'transition-transform duration-500 ease-out' : ''}`}
                style={banners.length > 1 ? { transform: `translateX(-${currentSlide * 100}%)` } : {}}
            >
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`${banners.length > 1 ? 'absolute' : ''} w-full h-full`}
                        style={banners.length > 1 ? { left: `${index * 100}%` } : {}}
                    >
                        <div className="relative w-full h-full">
                            <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = banner1; // Fallback image on error
                                }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                                <div className="container mx-auto px-4">
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="animate-slideInRight pt-18 px-16">
                                            <h2 className="text-[50px] font-bold mb-4 text-white">{banner.title}</h2>
                                        </div>
                                        <div className="animate-slideInLeft">
                                            <p className="text-[20px] text-center text-white">{banner.description}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Only show navigation controls if there's more than one banner */}
            {banners.length > 1 && (
                <>
                    {/* Navigation Arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2  hover:bg-opacity-100 text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots Navigation */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentSlide === index ? 'bg-white w-6' : 'bg-white bg-opacity-50'
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BannerCarousel;