import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProDrill from '../assets/Images/kapson-logo.png'
import Heavyduty from '../assets/Images/kapson-logo.png'
import CompactDrill from '../assets/Images/kapson-logo.png'
import MultiToolDrill from '../assets/Images/kapson-logo.png'
import DiamondTip from '../assets/Images/kapson-logo.png'
import CencelButton from '../assets/Images/kapson-logo.png'

const ProductsPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [subcategoryInfo, setSubcategoryInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        priceRange: [0, 5000],
        brands: [],
        sortBy: 'popularity'
    });
    const [showFilters, setShowFilters] = useState(false);

    // Mock data - in a real app, you would fetch this from an API
    const mockCategories = {
        "power-tools": {
            name: "Power Tools",
            subcategories: {
                "drills": {
                    name: "Drills",
                    description: "Professional-grade drills for all types of applications",
                    products: [
                        { id: 1, name: "ProDrill 2000", price: 129.99, brand: "IndustrialPro", rating: 4.5, image: ProDrill, inStock: true, features: ["20V", "Cordless", "Brushless Motor"] },
                        { id: 2, name: "HeavyDuty Drill", price: 159.99, brand: "PowerMaster", rating: 4.2, image: Heavyduty, inStock: true, features: ["20V", "Hammer Function", "LED Light"] },
                        { id: 3, name: "Compact Drill Set", price: 199.99, brand: "IndustrialPro", rating: 4.8, image: CompactDrill, inStock: false, features: ["12V", "2 Batteries", "Carrying Case"] },
                        { id: 4, name: "Multi-Tool Drill", price: 249.99, brand: "ToolPro", rating: 4.6, image: MultiToolDrill, inStock: true, features: ["18V", "6 Attachments", "Variable Speed"] },
                        { id: 5, name: "Diamond Tip Drill", price: 89.99, brand: "PowerMaster", rating: 4.3, image: DiamondTip, inStock: true, features: ["Corded", "Diamond Tipped", "Concrete Drilling"] }
                    ]
                },
                "sanders": {
                    name: "Sanders",
                    description: "Professional finishing sanders for smooth results",
                    products: [
                        { id: 6, name: "Orbital Sander Pro", price: 79.99, brand: "IndustrialPro", rating: 4.7, image: "/api/placeholder/400/400", inStock: true, features: ["Variable Speed", "Dust Collection", "5-inch Pad"] },
                        { id: 7, name: "Belt Sander 3000", price: 129.99, brand: "PowerMaster", rating: 4.4, image: "/api/placeholder/400/400", inStock: true, features: ["3×21 inch Belt", "Dust Bag", "7 Amp Motor"] },
                        { id: 8, name: "Detail Sander", price: 49.99, brand: "ToolPro", rating: 4.1, image: "/api/placeholder/400/400", inStock: true, features: ["Compact Size", "Detail Attachments", "Ergonomic Grip"] }
                    ]
                }
            }
        },
        "hand-tools": {
            name: "Hand Tools",
            subcategories: {
                "wrenches": {
                    name: "Wrenches",
                    description: "Professional-grade wrenches for all your fastening needs",
                    products: [
                        { id: 9, name: "Adjustable Wrench Set", price: 34.99, brand: "HandyTools", rating: 4.6, image: "/api/placeholder/400/400", inStock: true, features: ["3-Piece Set", "Chrome Vanadium", "Non-Slip Grip"] },
                        { id: 10, name: "Ratcheting Wrench Set", price: 79.99, brand: "IndustrialPro", rating: 4.9, image: "/api/placeholder/400/400", inStock: true, features: ["12-Piece Set", "72-Tooth Ratchet", "Chrome Finish"] }
                    ]
                }
            }
        }
    };

    useEffect(() => {
        // Simulate API fetch
        setTimeout(() => {
            const category = mockCategories[categoryId];
            if (category) {
                setCategoryInfo({
                    id: categoryId,
                    name: category.name
                });

                if (subcategoryId) {
                    const normalizedSubcategoryId = subcategoryId.toLowerCase();
                    const subcategory = category.subcategories[normalizedSubcategoryId];

                    if (subcategory) {
                        setSubcategoryInfo({
                            id: normalizedSubcategoryId,
                            name: subcategory.name,
                            description: subcategory.description
                        });
                        setProducts(subcategory.products);
                    }
                }
            }
            setLoading(false);
        }, 600);
    }, [categoryId, subcategoryId]);

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handlePriceChange = (range) => {
        setFilters({ ...filters, priceRange: range });
    };

    const handleBrandFilter = (brand) => {
        let newBrands = [...filters.brands];
        if (newBrands.includes(brand)) {
            newBrands = newBrands.filter(b => b !== brand);
        } else {
            newBrands.push(brand);
        }
        setFilters({ ...filters, brands: newBrands });
    };

    const handleSortChange = (sortValue) => {
        setFilters({ ...filters, sortBy: sortValue });
    };

    // Filter and sort products
    const filteredProducts = products
        .filter(product =>
            (product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1]) &&
            (filters.brands.length === 0 || filters.brands.includes(product.brand))
        )
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'rating':
                    return b.rating - a.rating;
                default: // popularity
                    return 0; // In a real app, you'd have a popularity metric
            }
        });

    // Extract unique brands for filter
    const availableBrands = [...new Set(products.map(product => product.brand))];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!categoryInfo || !subcategoryInfo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <h1 className="text-3xl font-bold text-gray-800">Products not found</h1>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                    Back to Category
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen pt-12 pb-16">
            {/* Breadcrumb Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-end lg:px-8 mb-8 cursor-pointer" onClick={() => navigate(-1)}>
                {/* <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <button
                                onClick={() => navigate('/')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Home
                            </button>
                        </li>
                        <li className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            <button
                                onClick={() => navigate('/categories')}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                Categories
                            </button>
                        </li>
                        <li className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            <button
                                onClick={() => navigate(`/categories/${categoryId}`)}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                {categoryInfo.name}
                            </button>
                        </li>
                        <li className="flex items-center">
                            <span className="mx-2 text-gray-400">/</span>
                            <span className="text-blue-600 font-medium">
                                {subcategoryInfo.name}
                            </span>
                        </li>
                    </ol>
                </nav> */}
                <img src={CencelButton} alt="Cencel" srcset="" className='h-8' />
            </div>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">{subcategoryInfo.name}</h1>
                <p className="mt-2 text-gray-600">{subcategoryInfo.description}</p>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters - Mobile Toggle */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={toggleFilters}
                            className="w-full py-2 px-4 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                        >
                            {showFilters ? "Hide Filters" : "Show Filters"}
                        </button>
                    </div>

                    {/* Filters Sidebar */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-64 flex-shrink-0`}>
                        <div className="bg-white p-4 rounded-lg shadow">
                            <h2 className="font-semibold text-gray-800 mb-4">Filters</h2>

                            {/* Price Range Filter */}
                            <div className="mb-6">
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Price Range</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max="300"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => handlePriceChange([filters.priceRange[0], parseInt(e.target.value)])}
                                        className="w-full"
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 mt-2">
                                    <span>${filters.priceRange[0]}</span>
                                    <span>${filters.priceRange[1]}</span>
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-6">
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Brands</h3>
                                {availableBrands.map(brand => (
                                    <div key={brand} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            id={`brand-${brand}`}
                                            checked={filters.brands.includes(brand)}
                                            onChange={() => handleBrandFilter(brand)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`brand-${brand}`} className="ml-2 text-sm text-gray-700">
                                            {brand}
                                        </label>
                                    </div>
                                ))}
                            </div>

                            {/* Sort By */}
                            <div>
                                <h3 className="font-medium text-sm text-gray-700 mb-2">Sort By</h3>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="popularity">Popularity</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        {filteredProducts.length === 0 ? (
                            <div className="bg-white p-8 rounded-lg shadow text-center">
                                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                                <p className="mt-2 text-gray-600">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-600"
                                    >
                                        <div className="relative aspect-w-1 aspect-h-1 w-full group">
                                            {/* Product Image with 3D perspective on hover */}
                                            <div
                                                className="relative w-full h-48 overflow-hidden rounded-lg shadow-lg transition-transform transform-gpu group-hover:scale-105 group-hover:rotate-6"
                                                onClick={() => navigate(`/product/${product.id}`)}
                                            >
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-contain"
                                                />

                                                {/* Centered button on hover */}
                                                <button
                                                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    View Product
                                                </button>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            {/* Brand */}
                                            <p className="text-sm text-blue-600 font-medium">{product.brand}</p>

                                            {/* Name */}
                                            <h3 className="mt-1 text-lg font-semibold text-gray-900">{product.name}</h3>

                                            {/* Rating */}
                                            <div className="mt-1 flex items-center">
                                                <div className="flex items-center">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg
                                                            key={i}
                                                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <p className="ml-1 text-sm text-gray-600">{product.rating}</p>
                                            </div>

                                            {/* Features */}
                                            <div className="mt-2 flex flex-wrap gap-1">
                                                {product.features.map((feature, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Price & CTA */}
                                            <div className="mt-4 flex items-center justify-between">
                                                <p className="text-xl font-bold text-gray-900">${product.price}</p>
                                                <button
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${product.inStock
                                                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                                                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                                        }`}
                                                    disabled={!product.inStock}
                                                >
                                                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;