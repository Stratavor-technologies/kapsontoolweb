import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getRequest } from '../Services/apiMethods';

const CategoryDetails = () => {
    const { categoryId } = useParams();
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);

    const getSubcategories = async () => {
        try { 
            const response = await getRequest(`/subCategories?categoryId=${categoryId}`);
            // console.log(response);
            if (response.isSuccess && response.items) {
                setSubcategories(response.items);
                
                // If we have at least one subcategory, we can extract the parent category info
                if (response.items.length > 0) {
                    setCategoryInfo(response.items[0].category);
                }
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {   
        getSubcategories();
    }, [categoryId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading...</h1>
                </div>
            </div>
        );
    }

    if (subcategories.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Category Not Found</h1>
                    <Link to="/categories" className="text-blue-600 hover:text-blue-800">
                        Return to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 pt-[90px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Category Header */}
                <div className="text-center mb-12">
                    {categoryInfo && (
                        <>
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{categoryInfo.name}</h1>
                            {categoryInfo.categoryImage && (
                                <div className="w-24 h-24 mx-auto mb-4">
                                    <img 
                                        src={categoryInfo.categoryImage} 
                                        alt={categoryInfo.name} 
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Subcategories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {subcategories.map((subcategory) => (
                        <Link
                            key={subcategory.id}
                            to={`/categories/${categoryId}/${subcategory.id}`}
                            className="subcategory-card group"
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                                <div className="aspect-w-16 aspect-h-9">
                                    <img
                                        src={subcategory.image}
                                        alt={subcategory.name}
                                        className="object-cover w-full h-[200px] transform transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        <h3 className="text-2xl font-bold text-white mb-2">{subcategory.name}</h3>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryDetails;