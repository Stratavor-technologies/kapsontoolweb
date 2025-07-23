import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRequest, postRequest } from "../Services/apiMethods";
import { useDispatch } from 'react-redux';
import { addToCartAPI } from '../store/cartSlice';

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const getProduct = async () => {
    try {
      const response = await getRequest(`/products/${productId}`);
      console.log(response);
      if (response.isSuccess && response.data) {
        // Map API data to your product structure
        setProduct({
          id: response.data.id,
          name: response.data.productName,
          price: response.data.basicPrice,
          mrp: response.data.mrp,
          description: response.data.productDescription,
          features: response.data.productFeature,
          specifications: {
            "Art Number": response.data.ArtNumber,
            "HSN Number": response.data.hsnNumber.hsnNumber,
            GST: `${response.data.hsnNumber.gstPercentage}%`,
            Stock: response.data.stock,
            "Pieces in Box": response.data.packagingDetails.piecesInBox,
            "Pieces in Pack": response.data.packagingDetails.piecesInPack,
          },
          // Store stock as a separate property for easy access
          stock: response.data.stock,
          // If your API returns full image URLs, use them directly
          // Otherwise, you may need to construct the full URL
          images:
            response.data.productImage.length > 0
              ? response.data.productImage.map((img) => img)
              : [
                  "https://media.istockphoto.com/id/1370911387/photo/work-tools-still-life.jpg?s=1024x1024&w=is&k=20&c=DkLBpSFDBGuMDfF2Fs8D6bKcs30nqaBb43_Jmiujx9s=",
                ],
          category: response.data.category.name,
          subCategory: response.data.subCategory.name,
          applications: response.data.applicationDetails,
        });
      } else {
        setProduct(null);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [productId]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => {
      const newQuantity = prev + change;
      // Ensure quantity is between 1 and available stock
      return Math.max(1, Math.min(newQuantity, product?.stock || 1));
    });
  };

  // Handle direct input change for quantity
  const handleQuantityInputChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    // Ensure quantity is between 1 and available stock
    setQuantity(Math.max(1, Math.min(value, product?.stock || 1)));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Check if quantity exceeds stock
    if (quantity > product.stock) {
      alert(`Only ${product.stock} items available in stock`);
      return;
    }

    try {
      // Validate product data
      if (!product) {
        throw new Error("Product data is missing");
      }

      console.log("Product data:", {
        id: product.id,
        price: product.price,
        name: product.name,
        description: product.description
      });

      // Create cart product with required fields
      const cartProduct = {
        _id: product.id,
        basicPrice: product.price,
        productName: product.name,
        productDescription: product.description
      };

      console.log("Sending to cart:", {
        product: cartProduct,
        quantity: quantity
      });

      // Dispatch the add to cart action
      const result = await dispatch(addToCartAPI({ 
        product: cartProduct, 
        quantity: quantity 
      }));

      console.log("Cart API result:", result);

      if (result.error) {
        throw new Error(result.error.message || "Failed to add to cart");
      }

      // alert("Item added to cart successfully!");
      // Navigate back one step
      navigate(-1);
    } catch (error) {
      console.error("Detailed add to cart error:", {
        message: error.message,
        stack: error.stack,
        product: product,
        quantity: quantity
      });
      alert(error.message || "Failed to add item to cart. Please try again.");
    }
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if quantity exceeds stock
      if (quantity > product.stock) {
        alert(`Only ${product.stock} items available in stock`);
        return;
      }

      try {
        // Call your cart API here
        const cartData = {
          items: [
            {
              productId: product.id,
              quantity: quantity,
              price: product.price,
            },
          ],
        };

        const response = await postRequest("/carts/addToCart", cartData , token);
        if (response.success== true) {
          navigate("/cart");
        } else {
          // Handle error
          console.error("Failed to proceed to checkout:", response.message);
          alert("Failed to proceed to chart. Please try again.");
        }
      } catch (error) {
        console.error("Error proceeding to checkout:", error);
        alert("An error occurred. Please try again.");
      }
    } else {
      // User is not logged in, redirect to login page
      navigate("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/categories")}
            className="text-blue-600 hover:text-blue-800"
          >
            Return to Categories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-[120px] sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="product-details-card bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="main-image-container rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain mx-auto"
                />
              </div>
              <div className="thumbnail-grid grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`thumbnail-image rounded-lg overflow-hidden bg-gray-100 ${
                      selectedImage === index ? "ring-2 ring-blue-500" : ""
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-contain mx-auto"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-baseline space-x-3">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">
                    ₹{product.price.toFixed(2)}
                  </p>
                  {product.mrp > product.price && (
                    <>
                      <p className="text-sm sm:text-base text-gray-500 line-through">
                        MRP: ₹{product.mrp.toFixed(2)}
                      </p>
                    </>
                  )}
                </div>
                
                {/* Stock Status */}
                <div className="mt-2">
                  {product.stock > 0 ? (
                    <p className="text-sm text-green-600">
                      {product.stock} items in stock
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">Out of stock</p>
                  )}
                </div>
              </div>

              <p className="text-gray-600">{product.description}</p>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Features
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-500">✓</span>
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Applications */}
              {product.applications && product.applications.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                    Applications
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.applications.map((application, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-blue-500">•</span>
                        <span className="text-gray-600">{application}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  Specifications
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(
                    ([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-500">{key}</p>
                        <p className="font-medium text-gray-900">{value}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Quantity and Actions */}
              {product.stock > 0 && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-700">Quantity:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-l hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity <= 1}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={handleQuantityInputChange}
                        min="1"
                        max={product.stock}
                        className="w-16 h-8 text-center border-t border-b border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleQuantityChange(1)}
                        className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-r hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={quantity >= product.stock}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">
                      (Max: {product.stock})
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 py-3 px-4 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={handleBuyNow}
                      className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Out of Stock Message */}
              {product.stock === 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium">This item is currently out of stock</p>
                    <p className="text-red-600 text-sm mt-1">Please check back later or contact us for availability</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;