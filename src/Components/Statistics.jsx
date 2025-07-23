import React, { useEffect, useState } from 'react';

const Statistics = () => {
    const [stats, setStats] = useState({
        experience: 0,
        countries: 0,
        customers: 0
    });

    const targetStats = {
        experience: 50,
        countries: 30,
        customers: 10000
    };

    useEffect(() => {
        const duration = 2000; // 2 seconds
        const steps = 60;
        const interval = duration / steps;

        const counters = {
            experience: targetStats.experience / steps,
            countries: targetStats.countries / steps,
            customers: targetStats.customers / steps
        };

        let currentStep = 0;

        const timer = setInterval(() => {
            currentStep++;
            setStats(prev => ({
                experience: Math.min(Math.round(prev.experience + counters.experience), targetStats.experience),
                countries: Math.min(Math.round(prev.countries + counters.countries), targetStats.countries),
                customers: Math.min(Math.round(prev.customers + counters.customers), targetStats.customers)
            }));

            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, interval);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Years of Experience */}
                    <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-white rounded-lg p-6 shadow-xl">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.experience}+
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Years of Experience
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Delivering Excellence Since 1974
                            </div>
                        </div>
                    </div>

                    {/* Countries */}
                    <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-white rounded-lg p-6 shadow-xl">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.countries}+
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Countries Worldwide
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Global Presence & Reach
                            </div>
                        </div>
                    </div>

                    {/* Satisfied Customers */}
                    <div className="text-center transform hover:scale-105 transition-transform duration-300">
                        <div className="bg-white rounded-lg p-6 shadow-xl">
                            <div className="text-4xl font-bold text-blue-600 mb-2">
                                {stats.customers.toLocaleString()}+
                            </div>
                            <div className="text-gray-600 font-semibold">
                                Satisfied Customers
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                                Trusted by Thousands
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center text-white pb-8">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Our Global Network</h3>
                    <p className="text-lg opacity-90 max-w-2xl mx-auto">
                        With a presence in over 30 countries and serving more than 10,000 satisfied customers,
                        we've built a reputation for excellence and reliability in the power tools industry.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Statistics; 