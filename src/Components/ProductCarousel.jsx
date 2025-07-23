import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getRequest } from "../Services/apiMethods";

const ProductCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate slides to show based on screen width
  const [slidesToShow, setSlidesToShow] = useState(4);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setSlidesToShow(1);
      } else if (window.innerWidth < 768) {
        setSlidesToShow(2);
      } else if (window.innerWidth < 1024) {
        setSlidesToShow(3);
      } else {
        setSlidesToShow(4);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getProducts = async () => {
    // const token = localStorage.getItem("token");
    // if (!token) {
    //   console.error("No token found in localStorage");
    //   setError("Authentication required");
    //   setLoading(false);
    //   return;
    // }

    try {
      setLoading(true);
      const response = await getRequest("/products");

      if (response.isSuccess && response.items) {
        setProducts(response.items);
      } else {
        setError("Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    let interval;
    if (isAutoPlaying && products.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const next = prev + 1;
          // Calculate max slides based on product length minus visible slides
          const maxSlides = Math.max(0, products.length - slidesToShow);
          return next > maxSlides ? 0 : next;
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length, slidesToShow]);

  const nextSlide = () => {
    const maxSlides = Math.max(0, products.length - slidesToShow);
    setCurrentSlide((prev) => (prev >= maxSlides ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxSlides = Math.max(0, products.length - slidesToShow);
    setCurrentSlide((prev) => (prev <= 0 ? maxSlides : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span className="block sm:inline">No products available.</span>
      </div>
    );
  }

  // Calculate translateX percentage based on current slide and slides to show
  const translatePercentage = (100 / slidesToShow) * currentSlide;

  return (
    <div
      className="relative w-full overflow-hidden p-2"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div
        className="flex transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${translatePercentage}%)` }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            className={`px-3 flex-shrink-0`}
            style={{ width: `${100 / slidesToShow}%` }}
            onClick={() => {
              navigate(`/product/${product.id}`);
            }}
          >
            <Link to={`/product/${product.id}`} className="block">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 h-full">
                <div className="relative aspect-square">
                  <img
                    src={product.productImage && product.productImage[0]}
                    alt={product.productName}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs md:text-sm">
                    {product.category?.name || "Unknown"}
                  </div>
                </div>
                <div className="p-3 md:p-4">
                  <h3 className="text-sm md:text-lg font-semibold text-gray-900 mb-1 md:mb-2 truncate">
                    {product.productName}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-blue-600">
                  ₹{product.mrp}
                  </p>
                  <p className="text-xs md:text-sm text-gray-600">
                    Art {product.ArtNumber}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-1 md:p-2 rounded-full shadow-lg transition-all duration-300 z-10"
      >
        <svg
          className="w-4 h-4 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 p-1 md:p-2 rounded-full shadow-lg transition-all duration-300 z-10"
      >
        <svg
          className="w-4 h-4 md:w-6 md:h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Pagination Indicators (Optional) */}
      {/* <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2">
        {Array.from({ length: Math.ceil(products.length / slidesToShow) }).map(
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 mx-1 rounded-full transition-all duration-300 ${
                currentSlide === index ? "w-6 bg-blue-600" : "w-2 bg-gray-300"
              }`}
            />
          )
        )}
      </div> */}
    </div>
  );
};

export default ProductCarousel;
