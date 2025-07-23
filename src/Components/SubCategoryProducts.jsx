import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getRequest } from '../Services/apiMethods';

const SubCategoryProducts = () => {
    const { categoryId, subcategoryId } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const navigate = useNavigate();

    const getProducts = async () => {
        try {   
            const response = await getRequest(`/products?subCategoryId=${subcategoryId}`);
            console.log(response);  
            if (response.isSuccess && response.items) {
                setProducts(response.items);
                
                // If there's at least one product, use its category/subcategory info
                if (response.items.length > 0) {
                    const firstProduct = response.items[0];
                    setCategoryInfo({
                        categoryName: firstProduct.category?.name || "Category",
                        subcategoryName: firstProduct.subCategory?.name || "Subcategory",
                        description: "Products in this subcategory" // Add a description API field if available
                    });
                }
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {  
        getProducts();
    }, [categoryId, subcategoryId]);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Loading products...</h1>
                </div>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">No Products Found</h1>
                    <Link to="/categories" className="text-blue-600 hover:text-blue-800">
                        Return to Categories
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[90px] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Subcategory Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {categoryInfo?.subcategoryName || "Products"}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        {categoryInfo?.description || "Browse our selection of quality products"}
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div 
                            key={product.id} 
                            className="product-card group cursor-pointer"
                            onClick={() => handleProductClick(product.id)}
                        >
                            <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-300 group-hover:shadow-2xl">
                                <div className="aspect-w-16 aspect-h-9">
                                    {product.productImage && product.productImage.length > 0 ? (
                                        <img
                                            src={product.productImage[0]} // Use the first image from the array
                                            alt={product.productName}
                                            className="object-cover w-full h-64 transform transition-transform duration-500 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="bg-gray-200 w-full h-64 flex items-center justify-center">
                                            <span className="text-gray-500">No image available</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.productName}</h3>
                                    <p className="text-gray-600 mb-4">{product.productDescription}</p>
                                    {/* <div className="flex flex-wrap gap-2 mb-4">
                                        {product.productFeature && product.productFeature.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                            >
                                                {feature}
                                            </span>
                                        ))}
                                    </div> */}
                                    <div className="flex justify-between items-center">
                                        <span className="text-2xl font-bold text-blue-600">
                                         ₹{product.mrp}
                                        </span>
                                        <button 
                                            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                            onClick={() => handleProductClick(product.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubCategoryProducts;