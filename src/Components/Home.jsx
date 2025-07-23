import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BannerCarousel from './BannerCarousel';
import ProductCarousel from './ProductCarousel';
import Statistics from './Statistics';
import { getRequest } from '../Services/apiMethods';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const autoPlayRef = useRef(null);

    const getCategory = async () => {
        try {
            const response = await getRequest('/categories');
            // console.log(response);
            if (response.isSuccess && response.items) {
                setCategories(response.items);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    }

    const nextSlide = () => {
        if (categories.length <= 3) return;
        setCurrentIndex((prevIndex) => 
            prevIndex === categories.length - 3 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        if (categories.length <= 3) return;
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? categories.length - 3 : prevIndex - 1
        );
    };

    // Auto play functionality
    useEffect(() => {
        if (categories.length <= 3) return;
        
        const play = () => {
            autoPlayRef.current = setTimeout(() => {
                nextSlide();
            }, 3000); // Change slide every 3 seconds
        };

        play();

        return () => {
            if (autoPlayRef.current) {
                clearTimeout(autoPlayRef.current);
            }
        };
    }, [currentIndex, categories.length]);

    useEffect(() => {
        getCategory();
    }, []);

    // Determine what to render based on category count
    const renderCategories = () => {
        if (loading) {
            return (
                <div className="col-span-3 text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                    <p className="mt-2">Loading categories...</p>
                </div>
            );
        }

        if (categories.length <= 3) {
            // If 3 or fewer categories, show all without carousel
            return categories.map((category) => (
                <CategoryCard key={category.id} category={category} />
            ));
        } else {
            // If more than 3 categories, show as carousel
            return (
                <div className="col-span-3 relative">
                    <div className="overflow-hidden">
                        <div 
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                            ref={carouselRef}
                        >
                            {categories.map((category) => (
                                <div key={category.id} className="min-w-[33.333%] px-2">
                                    <CategoryCard category={category} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Navigation arrows */}
                    <button 
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-r-md"
                    >
                        ❮
                    </button>
                    <button 
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-l-md"
                    >
                        ❯
                    </button>
                    
                    {/* Pagination dots */}
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: categories.length - 2 }).map((_, index) => (
                            <button
                                key={index}
                                className={`h-2 w-2 mx-1 rounded-full ${
                                    currentIndex === index ? 'bg-gray-800' : 'bg-gray-300'
                                }`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            );
        }
    };

    // Extract category card into its own component for reuse
    const CategoryCard = ({ category }) => (
        <Link to={`/categories/${category.id}`} className="category-card block">
            <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                    src={category.categoryImage}
                    alt={category.name}
                    className="w-full h-48 object-container transform hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                </div>
            </div>
        </Link>
    );

    return (
        <div className="min-h-screen pt-[65px] ">
            {/* Hero Section with Banner Carousel */}
            <div className="relative h-full pb-38  overflow-hidden">
                <BannerCarousel />
            </div>

            {/* Statistics Section */}
            <div className='pt-10'>
            <Statistics />
            </div>

            {/* Featured Categories */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Categories</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {renderCategories()}
                    </div>
                </div>

                {/* Featured Products */}
                <div className="container mx-auto px-4 py-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Products</h2>
                    <ProductCarousel />
                </div>
            </div>
        </div>
    );
};

export default Home;