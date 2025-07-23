import React, { useState, useEffect } from 'react';

const QualityCertificates3D = () => {
    // Sample certificates and quality statements
    const certificates = [
        {
            id: 1,
            title: "ISO 9001:2015",
            description: "Quality Management System certification ensuring consistent quality in all processes.",
        },
        {
            id: 2,
            title: "CE Certification",
            description: "Our industrial tools meet all European health, safety, and environmental protection standards.",
        },
        {
            id: 3,
            title: "Quality Promise",
            description: "We maintain strict quality control through rigorous testing of all our industrial tools.",
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);

    // Auto-run functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % certificates.length);
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [certificates.length]);

    return (
        <div className="w-full py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Our Quality Commitment</h2>
                <p className="text-center text-gray-600 max-w-3xl mx-auto mb-12">
                    We pride ourselves on delivering the highest quality industrial tools. Our certifications and quality standards ensure that every product meets the strictest requirements.
                </p>

                {/* 3D Certificate Carousel */}
                <div className="relative h-96 max-w-4xl mx-auto">
                    {/* Certificate Cards */}
                    <div className="relative w-full h-full perspective-800">
                        {certificates.map((cert, index) => {
                            // Calculate position based on active index
                            const isActive = index === activeIndex;
                            const isPrev = (index === activeIndex - 1) || (activeIndex === 0 && index === certificates.length - 1);
                            const isNext = (index === activeIndex + 1) || (activeIndex === certificates.length - 1 && index === 0);

                            let positionClass = "hidden";
                            let transformStyle = {};
                            let zIndex = 0;

                            if (isActive) {
                                positionClass = "block";
                                transformStyle = { transform: "rotateY(0deg) translateZ(150px)" };
                                zIndex = 30;
                            } else if (isPrev) {
                                positionClass = "block";
                                transformStyle = { transform: "rotateY(-45deg) translateZ(0) translateX(-300px)", opacity: 0.7 };
                                zIndex = 20;
                            } else if (isNext) {
                                positionClass = "block";
                                transformStyle = { transform: "rotateY(45deg) translateZ(0) translateX(300px)", opacity: 0.7 };
                                zIndex = 20;
                            }

                            return (
                                <div
                                    key={cert.id}
                                    className={`absolute top-0 w-full h-full ${positionClass} transition-all duration-500`}
                                    style={{
                                        ...transformStyle,
                                        zIndex
                                    }}
                                >
                                    <div className="bg-white w-full h-full rounded-xl shadow-xl p-8 flex flex-col items-center justify-center border border-gray-200">
                                        <h3 className="text-2xl font-bold mb-4 text-center">{cert.title}</h3>
                                        <p className="text-gray-600 text-center">{cert.description}</p>

                                        {isActive && (
                                            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                                                <div className="bg-blue-500 text-white py-2 px-6 rounded-full transform hover:scale-105 transition-transform cursor-pointer">
                                                    View Certificate
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Indicators */}
                <div className="flex justify-center mt-8 space-x-2">
                    {certificates.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${index === activeIndex ? "bg-blue-600" : "bg-gray-300"
                                }`}
                            aria-label={`Go to certificate ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QualityCertificates3D;