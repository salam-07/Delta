import React from 'react';
import { TrendingUp, Users, Shield, Newspaper } from 'lucide-react';

const AboutSection = () => {
    return (
        <section id="about" className="py-20 lg:py-32 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-black via-green-950/10 to-black"></div>
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="text-center mb-16 about-content">
                    <span className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-sm font-medium mb-4 text-green-400">
                        About Us
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            What We Do
                        </span>
                    </h2>
                    <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
                        Delta provides cutting-edge simulated stock market competitions that mirror real-world trading environments.
                        Our platform empowers participants to learn, compete, and master financial markets in a risk-free environment.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="about-content glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <TrendingUp size={32} className="text-black" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Real-Time Markets</h3>
                        <p className="text-gray-400">
                            Experience live market conditions with real-time price updates and dynamic market movements.
                        </p>
                    </div>

                    <div className="about-content glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Users size={32} className="text-black" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Team Competitions</h3>
                        <p className="text-gray-400">
                            Compete individually or as teams in structured competitions with leaderboards and rankings.
                        </p>
                    </div>

                    <div className="about-content glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Shield size={32} className="text-black" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Safe Learning</h3>
                        <p className="text-gray-400">
                            Practice trading strategies without financial risk in our secure simulation environment.
                        </p>
                    </div>

                    <div className="about-content glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <Newspaper size={32} className="text-black" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">Personalized News & Current Affairs</h3>
                        <p className="text-gray-400">
                            Learn to maneuver in current or past market situations, personalized to your competing audience                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
