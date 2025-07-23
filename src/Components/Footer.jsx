import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRequest } from '../Services/apiMethods';

const Footer = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCategories = async () => {
        try {
            const response = await getRequest('/categories');
            console.log("Categories response:", response); // Debug log
            if (response && response.items) {
                setCategories(response.items);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        getCategories();
    }, []);

    const footerSections = [
        {
            title: "Quick Links",
            links: [
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Categories", path: "/categories" },
                { name: "Contact", path: "/contact" }
            ]
        },
        {
            title: "Categories",
            isDynamic: true
        },
        {
            title: "Contact Info",
            items: [
                { icon: "📞", text: "+1 (555) 123-4567" },
                { icon: "✉️", text: "info@industrialpro.com" },
                { icon: "📍", text: "123 Industrial Ave, Tech City" },
                { icon: "⏰", text: "Mon - Sat: 9:00 AM - 6:00 PM" }
            ]
        }
    ];

    return (
        <footer className="footer-3d">
            <div className="footer-content px-28 ">
                {/* Main Footer Content */}
                <div className="footer-sections flex flex-wrap justify-between "> 
                    {footerSections.map((section, index) => (
                        <div key={index} className="footer-section">
                            <h3 className="footer-title">{section.title}</h3>
                            {section.isDynamic ? (
                                // Dynamic categories section with scroll if more than 5
                                <div className={`footer-list ${categories.length > 5 ? 'max-h-40 overflow-y-auto' : ''}`}>
                                    {loading ? (
                                        <p>Loading categories...</p>
                                    ) : categories.length > 0 ? (
                                        <ul>
                                            {categories.map((category) => (
                                                <li key={category.id}>
                                                    <Link 
                                                        to={`/categories/${category.id}`}
                                                        className="footer-link"
                                                    >
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No categories found</p>
                                    )}
                                </div>
                            ) : section.links ? (
                                // Standard links section
                                <ul className="footer-list">
                                    {section.links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link 
                                                to={link.path}
                                                className="footer-link"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                // Contact info section
                                <ul className="footer-list">
                                    {section.items?.map((item, itemIndex) => (
                                        <li 
                                            key={itemIndex}
                                            className="footer-contact-item"
                                        >
                                            <span className="contact-icon">{item.icon}</span>
                                            <span>{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                {/* Copyright */}
                <div className="footer-bottom">
                    <div className="copyright">
                        © {new Date().getFullYear()} TTC ROBOTROINICS. All rights reserved.
                    </div>
                    <div className="footer-extra-links">
                        <Link to="/privacy" className="footer-bottom-link">Privacy Policy</Link>
                        <span className="separator">•</span>
                        <Link to="/terms" className="footer-bottom-link">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;