import React from 'react';
import Certificate from '../assets/Images/certificate.jpg';
import Certificate1 from '../assets/Images/certificate2.jpg';
import Certificate2 from '../assets/Images/certificate3.jpg';

const About = () => {
    const certificates = [
        {
            id: 1,
            name: "ISO 9001:2015",
            description: "Quality Management System",
            image: Certificate
        },
        {
            id: 2,
            name: "ISO 14001:2015",
            description: "Environmental Management System",
            image: Certificate1
        },
        {
            id: 3,
            name: "OHSAS 18001:2007",
            description: "Occupational Health and Safety",
            image: Certificate2
        }
    ];

    const journey = [
        {
            year: "2010",
            title: "Company Founded",
            description: "Started with a vision to provide high-quality industrial tools"
        },
        {
            year: "2015",
            title: "Global Expansion",
            description: "Expanded operations to multiple countries across Asia and Europe"
        },
        {
            year: "2018",
            title: "Innovation Award",
            description: "Received industry recognition for innovative product development"
        },
        {
            year: "2020",
            title: "Digital Transformation",
            description: "Launched e-commerce platform and digital services"
        },
        {
            year: "2023",
            title: "Sustainability Focus",
            description: "Committed to eco-friendly manufacturing and sustainable practices"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 mt-[60px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Leading provider of industrial tools and equipment, committed to quality, innovation, and customer satisfaction.
                    </p>
                </div>

                {/* Company Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    <div className="about-card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            Founded in 2010, we've grown from a small local supplier to a global leader in industrial tools and equipment. Our commitment to quality and innovation has helped us build lasting relationships with customers worldwide.
                        </p>
                        <p className="text-gray-600">
                            We believe in sustainable practices and continuous improvement, ensuring our products meet the highest standards while minimizing environmental impact.
                        </p>
                    </div>
                    <div className="about-card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
                        <p className="text-gray-600 mb-4">
                            To provide innovative, high-quality industrial tools that empower professionals to achieve their best work while promoting sustainable practices and environmental responsibility.
                        </p>
                        <p className="text-gray-600">
                            We strive to be the trusted partner for all industrial tool needs, delivering excellence in every product and service we offer.
                        </p>
                    </div>
                </div>

                {/* Certificates Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Certifications</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {certificates.map((cert) => (
                            <div key={cert.id} className="certificate-card">
                                <div className="relative overflow-hidden rounded-xl bg-white shadow-lg">
                                    <img
                                        src={cert.image}
                                        alt={cert.name}
                                        className="w-full h-48 object-contain"
                                    />
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-2">{cert.name}</h3>
                                        <p className="text-gray-600">{cert.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Journey Timeline */}
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Journey</h2>
                    <div className="relative">
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-blue-200"></div>
                        {journey.map((step, index) => (
                            <div key={index} className="journey-card">
                                <div className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                                    <div className="w-full md:w-1/2 p-4">
                                        <div className="bg-white rounded-lg shadow-lg p-6">
                                            <div className="text-blue-600 font-bold mb-2">{step.year}</div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                            <p className="text-gray-600">{step.description}</p>
                                        </div>
                                    </div>
                                    <div className="hidden md:block w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About; 