import React from 'react';
import { TrendingUp, Users, Target, CheckCircle, Shield } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: Shield,
            title: 'Full Admin Controls',
            description: 'Manage your competition with complete a complete admin dashboard',
        },
        {
            icon: Users,
            title: 'Portfolio Management',
            description: 'Track your investments, analyze performance, and manage your virtual portfolio.',
        },
        {
            icon: Target,
            title: 'Competition Events',
            description: 'Participate in time-based competitions with specific rules, objectives and gamified rewards',
        },
        {
            icon: CheckCircle,
            title: 'Trade History',
            description: 'Complete transaction history with detailed analytics and performance metrics.',
        },
    ];

    return (
        <section id="features" className="py-20 lg:py-32 px-4 bg-gradient-to-b from-black to-green-950/20">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-sm font-medium mb-4 text-green-400">
                        Features
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            Everything You Need
                        </span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                        Our platform provides comprehensive tools for market simulation and competitive trading.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all hover:transform hover:scale-105"
                        >
                            <feature.icon size={40} className="text-green-400 mb-4" />
                            <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
