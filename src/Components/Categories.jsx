import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRequest } from '../Services/apiMethods';

const Categories = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        getCategory();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-[90px] pb-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Our Categories
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our wide range of industrial tools and equipment, carefully categorized for your convenience.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-xl text-gray-500">Loading categories...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="cursor-pointer"
                                onClick={() => navigate(`/categories/${category.id}`)}
                            >
                                <div className="relative h-64 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                                    {/* Background Image with Overlay */}
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ 
                                            backgroundImage: `url(${category.categoryImage})`,
                                            transform: 'translateZ(-10px)',
                                            perspective: '1000px'
                                        }}
                                    ></div>
                                    
                                    {/* Dark Overlay for better text visibility */}
                                    <div className="absolute inset-0 bg-black opacity-50"></div>
                                    
                                    {/* Category Name */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <h2 className="text-3xl font-bold text-white text-center px-4 transform transition-transform duration-300 hover:scale-110">
                                            {category.name}
                                        </h2>
                                    </div>
                                    
                                    {/* 3D Effect Shadow */}
                                    <div className="absolute inset-0 shadow-inner opacity-30"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Categories;