import React from 'react';
import { MessageCircle } from 'lucide-react';

const TestimonialsSection = () => {
    const testimonials = [
        {
            quote: "Delta transformed how I understand stock markets. The competitions are intense and educational!",
            author: "Sarah Chen",
            role: "Finance Student",
        },
        {
            quote: "Best platform for practicing trading strategies. The real-time data makes it feel authentic.",
            author: "Michael Rodriguez",
            role: "Investment Club President",
        },
        {
            quote: "Our entire class uses Delta for market simulations. The analytics are incredibly detailed.",
            author: "Dr. James Wilson",
            role: "Economics Professor",
        },
    ];

    return (
        <section className="py-20 lg:py-32 px-4 relative">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-sm font-medium mb-4 text-green-400">
                        Testimonials
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            What Participants Say
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 hover:border-green-500/40 transition-all"
                        >
                            <MessageCircle size={40} className="text-green-400 mb-6" />
                            <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                            <div className="border-t border-gray-800 pt-4">
                                <p className="font-bold text-white">{testimonial.author}</p>
                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
