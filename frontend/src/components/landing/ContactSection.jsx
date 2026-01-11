import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactSection = () => {
    return (
        <section id="contact" className="py-20 lg:py-32 px-4 bg-gradient-to-b from-black to-green-950/20">
            <div className="container mx-auto max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            Get in Touch
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300">
                        Have questions? Want to organize a competition? We're here to help.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    <div className="glass-card p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 text-center">
                        <Mail className="mx-auto mb-4 text-green-400" size={32} />
                        <h3 className="font-bold mb-2">Email</h3>
                        <p className="text-gray-400 text-sm">support@delta.com</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 text-center">
                        <Phone className="mx-auto mb-4 text-green-400" size={32} />
                        <h3 className="font-bold mb-2">Phone</h3>
                        <p className="text-gray-400 text-sm">+1 (555) 123-4567</p>
                    </div>
                    <div className="glass-card p-6 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 text-center">
                        <MapPin className="mx-auto mb-4 text-green-400" size={32} />
                        <h3 className="font-bold mb-2">Location</h3>
                        <p className="text-gray-400 text-sm">Virtual Worldwide</p>
                    </div>
                </div>

                <div className="text-center">
                    <Link
                        to="/signup"
                        className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-full text-lg font-bold hover:from-green-400 hover:to-emerald-500 transition-all shadow-xl shadow-green-500/30"
                    >
                        Start Your Journey Today
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
