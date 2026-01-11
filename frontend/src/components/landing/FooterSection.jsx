import React from 'react';
import { Link } from 'react-router-dom';
import { ChartNoAxesCombined } from 'lucide-react';

const FooterSection = () => {
    return (
        <footer className="py-12 px-4 border-t border-gray-800">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <ChartNoAxesCombined className="text-green-500" size={28} />
                            <span className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                Delta
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Simulated stock market competitions for education and competition.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#about" className="hover:text-green-400 transition-colors">About</a></li>
                            <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                            <li><a href="#process" className="hover:text-green-400 transition-colors">How It Works</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Resources</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">FAQ</a></li>
                            <li><a href="#contact" className="hover:text-green-400 transition-colors">Support</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#" className="hover:text-green-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-green-400 transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 Delta. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <Link to="/login" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                            Login
                        </Link>
                        <Link to="/signup" className="text-sm text-gray-400 hover:text-green-400 transition-colors">
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default FooterSection;
