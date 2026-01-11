import React from 'react';
import { Heart, Laptop } from 'lucide-react';

const PricingSection = () => {
    return (
        <section id="pricing" className="py-16 lg:py-24 px-4 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-green-950/10 to-black"></div>

            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="glass-card p-8 md:p-10 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20">
                    <div className="text-center mb-8">
                        <span className="inline-block px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-medium mb-3 text-green-400">
                            Pricing
                        </span>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                            <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                                Pay What You Can
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-xl mx-auto">
                            We offer our competitions at any price — even free. Financial education should be accessible to everyone.
                        </p>
                    </div>

                    {/* Price Display */}
                    <div className="flex items-center justify-center gap-3 mb-8">
                        <span className="text-4xl md:text-5xl font-black text-green-400">$0</span>
                        <span className="text-2xl text-gray-600">—</span>
                        <span className="text-4xl md:text-5xl font-black text-green-400">$∞</span>
                    </div>

                    {/* Donation Info */}
                    <div className="border-t border-gray-800 pt-6">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-green-400">$1,000+</span>
                                <span className="text-gray-400 text-2xl">Donated</span>
                            </div>
                            <div className="hidden sm:block w-px h-8 bg-gray-700"></div>
                            <div className="flex items-center gap-4 text-lg text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Heart size={14} className="text-green-500" /> Orphanages
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Laptop size={14} className="text-green-500" /> Laptops for students
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PricingSection;
