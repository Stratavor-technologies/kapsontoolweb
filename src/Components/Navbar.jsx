import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { fetchCartItems } from '../store/cartSlice';
import TTC from "../assets/Images/TTCMainPage.png";
import { getRequest } from "../Services/apiMethods";

const Navbar = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navbarRef = useRef(null);
  const dropdownRefs = useRef({});
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const leaveTimeoutRef = useRef(null);
  const dispatch = useDispatch();
  
  // Get cart data from Redux state
  const { cartData, status } = useSelector((state) => state.cart);
  const totalItems = cartData?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  console.log("Navbar - cartData:", cartData); // Debug log
  console.log("Navbar - totalItems:", totalItems); // Debug log

  const getCategory = async () => {
    try {
      const response = await getRequest("/categories");
      if (response.isSuccess && response.items) {
        setCategories(response.items);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  // Fetch cart items when authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, isAuthenticated]);

  // Set up polling for cart updates
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const pollInterval = setInterval(() => {
      dispatch(fetchCartItems());
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(pollInterval);
  }, [dispatch]);

  // Contact information with icons
  const contactOptions = [
    {
      icon: "✉️",
      label: "Email",
      value: "info@industrialpro.com",
      action: () => (window.location.href = "mailto:info@industrialpro.com"),
      clickable: true,
    },
    {
      icon: "📱",
      label: "Phone",
      value: "+1 (555) 123-4567",
      action: () => (window.location.href = "tel:+1 (555) 123-4567"),
      clickable: true,
    },
    {
      icon: "📍",
      label: "Address",
      value: "123 Industrial Ave, Tech City",
      clickable: false,
    },
  ];

  const profileOptions = () => {
    if (isAuthenticated) {
      return [
        {
          icon: " 👤",
          label: "Profile",
          action: () => navigateTo("/profile"),
          clickable: true,
        },
        {
          icon: "✨",
          label: "Order History",
          action: () => navigateTo("/order-history"),
          clickable: true,
        },
        {
          icon: "👋",
          label: "Logout",
          action: () => setIsLogoutModalOpen(true),
          clickable: true,
        },
      ];
    } else {
      return [
        {
          icon: "🔐",
          label: "Sign In",
          action: () => navigateTo("/login"),
          clickable: true,
        },
        {
          icon: "✨",
          label: "Sign Up",
          action: () => navigateTo("/Singup"),
          clickable: true,
        },
      ];
    }
  };

  // Logout Modal Component
  const LogoutModal = () => {
    const handleLogout = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setIsLogoutModalOpen(false);
      navigate("/");
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex justify-center items-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4">
          <h2 className="text-xl font-bold mb-4">Confirm Logout</h2>
          <p className="mb-6">Are you sure you want to log out?</p>
          <div className="flex justify-end space-x-4">
            <button
              onClick={() => setIsLogoutModalOpen(false)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 20;
      if (navbarRef.current) {
        setIsScrolled(scrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Position dropdown properly based on viewport
  useEffect(() => {
    if (activeDropdown) {
      const dropdownEl = dropdownRefs.current[activeDropdown];
      if (dropdownEl) {
        const rect = dropdownEl.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Check if dropdown extends beyond right edge of viewport
        if (rect.right > viewportWidth) {
          dropdownEl.style.left = "auto";
          dropdownEl.style.right = "0";
        } else {
          dropdownEl.style.left = "0";
          dropdownEl.style.right = "auto";
        }

        // Ensure dropdown doesn't go below viewport
        const viewportHeight = window.innerHeight;
        if (rect.bottom > viewportHeight) {
          dropdownEl.style.maxHeight = `${viewportHeight - rect.top - 20}px`;
          dropdownEl.style.overflowY = "auto";
        }
      }
    }
  }, [activeDropdown]);

  // Default icons array for categories that don't have an image
  const defaultIcons = ["🔧", "⚡", "🛡️", "⚙️", "🔨", "🧰"];

  // Navigation handlers
  const navigateTo = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    clearTimeout(leaveTimeoutRef.current);
  };

  // New Dropdown Handlers
  const handleMouseEnter = (dropdownId) => {
    clearTimeout(leaveTimeoutRef.current);
    setActiveDropdown(dropdownId);
  };

  const handleMouseLeave = () => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
        clearTimeout(leaveTimeoutRef.current);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      clearTimeout(leaveTimeoutRef.current);
    };
  }, [activeDropdown]);

  return (
    <div>
      <nav
        ref={navbarRef}
        className={`navbar-3d fixed top-0 left-0 right-0 z-50 ${
          isScrolled ? "shadow-lg" : ""
        } bg-black/20 backdrop-blur-4xl`}
        style={{
          transform: isScrolled
            ? "translateY(-2px) translateZ(0)"
            : "translateY(0) translateZ(0)",
          backgroundColor: isScrolled
            ? "white"
            : "white",
        }}
      >
        <div className="navbar-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8  flex justify-between items-center">
          {/* Logo */}
          <div
            className="navbar-logo group cursor-pointer"
            onClick={() => navigateTo("/")}
          >
            <img src={TTC} alt="Logo" className="h-10 sm:h-16 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Main Navigation Links */}
            <div
              className="relative dropdown-container"
              onMouseEnter={() => handleMouseEnter("tools")}
              onMouseLeave={handleMouseLeave}
            >
              <span
                className="menu-link group text-black hover:text-blue-400 transition-colors duration-200 cursor-pointer flex items-center"
                onClick={() => navigateTo("/categories")}
              >
                Industrial Tools
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
              </span>

              {activeDropdown === "tools" && (
                <div className="dropdown-3d">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 cursor-pointer"
                      onClick={() => navigateTo(`/categories/${category.id}`)}
                    >
                      {category.categoryImage ? (
                        <img
                          src={category.categoryImage}
                          alt={category.name}
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="text-2xl">
                          {defaultIcons[index % defaultIcons.length]}
                        </span>
                      )}
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span
              className="menu-link group text-black hover:text-blue-400 transition-colors duration-200 cursor-pointer relative"
              onClick={() => navigateTo("/about")}
            >
              About Us
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full"></span>
            </span>

            {/* Desktop Icons */}
            <div className="flex items-center space-x-4">
              <div
                className="relative dropdown-container"
                onMouseEnter={() => handleMouseEnter("contact")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="menu-link group p-2 hover:bg-gray-800 rounded-full text-2xl sm:text-3xl transition-colors duration-200 flex items-center"
                  aria-label="Contact options"
                >
                  📞
                </button>

                {activeDropdown === "contact" && (
                  <div
                    className="dropdown-3d"
                    style={{ right: 0, left: "auto" }}
                  >
                    {contactOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-3 text-white ${
                          option.clickable
                            ? "cursor-pointer hover:bg-gray-800 rounded-lg"
                            : ""
                        }`}
                        onClick={option.clickable ? option.action : undefined}
                        role={option.clickable ? "button" : undefined}
                        tabIndex={option.clickable ? 0 : undefined}
                        onKeyDown={(e) =>
                          option.clickable &&
                          e.key === "Enter" &&
                          option.action?.()
                        }
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <div>
                          <div className="contact-label text-sm text-gray-400">
                            {option.label}
                          </div>
                          <div className="contact-value">{option.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                className="relative menu-link p-2 hover:bg-gray-800 rounded-full text-2xl sm:text-3xl transition-colors duration-200"
                onClick={() => navigate("/cart")}
                aria-label="View Cart"
              >
                🛒
                {totalItems > 0 && (
                  <span className="absolute -top-0 -right-0 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-1">
                    {totalItems}
                  </span>
                )}
              </button>

              <div
                className="relative dropdown-container"
                onMouseEnter={() => handleMouseEnter("profile")}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  className="menu-link group p-2 hover:bg-gray-800 rounded-full text-2xl sm:text-3xl transition-colors duration-200 flex items-center"
                  aria-label="Profile options"
                >
                  👤
                </button>

                {activeDropdown === "profile" && (
                  <div
                    className="dropdown-3d"
                    style={{ right: 0, left: "auto" }}
                  >
                    {profileOptions().map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 py-2 px-4 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 cursor-pointer"
                        onClick={option.action}
                      >
                        <span className="text-2xl">{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden">
            <button
              className="relative w-10 h-10 focus:outline-none z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6">
                <span
                  className={`absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                    mobileMenuOpen
                      ? "rotate-45 translate-y-0"
                      : "-translate-y-2"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                    mobileMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                ></span>
                <span
                  className={`absolute h-0.5 w-6 bg-white transform transition duration-300 ease-in-out ${
                    mobileMenuOpen
                      ? "-rotate-45 translate-y-0"
                      : "translate-y-2"
                  }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className={`fixed inset-y-0 right-0 w-full max-w-sm bg-black shadow-xl transform transition-transform duration-300 ease-in-out ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-screen">
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-black">
                  <div className="text-xl font-bold text-white">Menu</div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Menu Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black">
                  {/* Main Navigation */}
                  <div className="space-y-2">
                    <div
                      className="flex items-center space-x-3 p-3 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                      onClick={() => navigateTo("/")}
                    >
                      <span className="text-xl">🏠</span>
                      <span>Home</span>
                    </div>

                    {/* Tools Categories */}
                    <div className="space-y-2">
                      <div
                        className="flex items-center justify-between p-3 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                        onClick={() => handleMouseEnter("tools")}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">🛠️</span>
                          <span>Industrial Tools</span>
                        </div>
                      </div>
                      <div
                        className={`pl-8 space-y-2 transition-all duration-200 ${
                          activeDropdown === "tools" ? "block" : "hidden"
                        }`}
                      >
                        {categories.map((category, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                            onClick={() =>
                              navigateTo(`/categories/${category.id}`)
                            }
                          >
                            {category.categoryImage ? (
                              <img
                                src={category.categoryImage}
                                alt={category.name}
                                className="w-6 h-6 object-contain"
                              />
                            ) : (
                              <span className="text-lg">
                                {defaultIcons[index % defaultIcons.length]}
                              </span>
                            )}
                            <span>{category.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* <div
                      className="flex items-center space-x-3 p-3 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                      onClick={() => handleMouseEnter("profile")}
                    >
                      <span className="text-xl">👤</span>
                      <span>Account</span>
                    </div> */}
                  </div>

                  {/* Contact Information */}
                  <div className="bg-gray-900 p-4 rounded-lg">
                    <div className="text-sm font-medium text-gray-400 mb-3">
                      Contact Us
                    </div>
                    {contactOptions.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-3 p-2 rounded-lg ${
                          option.clickable
                            ? "hover:bg-gray-800 cursor-pointer"
                            : ""
                        }`}
                        onClick={option.action}
                      >
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <div className="text-sm text-gray-400">
                            {option.label}
                          </div>
                          <div className="text-white">{option.value}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Account section */}
                  <div
                    className="flex items-center space-x-3 p-3 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                    onClick={() => handleMouseEnter("profile")}
                  >
                    <span className="text-xl">👤</span>
                    <span>Account</span>
                  </div>
                  <div
                    className={`pl-8 space-y-2 transition-all duration-200 ${
                      activeDropdown === "profile" ? "block" : "hidden"
                    }`}
                  >
                    {profileOptions().map((option, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2 text-white hover:bg-gray-800 rounded-lg cursor-pointer"
                        onClick={option.action}
                      >
                        <span className="text-lg">{option.icon}</span>
                        <span>{option.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mobile Footer */}
                <div className="p-4 border-t border-gray-800 bg-black">
                  <button
                    className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => navigate("/cart")}
                  >
                    <span className="text-xl">🛒</span>
                    <span>View Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      {isLogoutModalOpen && <LogoutModal />}
    </div>
  );
};

export default Navbar;
