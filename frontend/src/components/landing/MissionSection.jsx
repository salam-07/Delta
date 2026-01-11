import React from 'react';

const MissionSection = () => {
    return (
        <section id="mission" className="py-20 lg:py-32 px-4 relative">
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="container mx-auto max-w-4xl relative z-10">
                <div className="text-center">
                    <span className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-sm font-medium mb-4 text-green-400">
                        Our Mission
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            Empowering Financial Education
                        </span>
                    </h2>
                    <p className="text-xl text-gray-300 leading-relaxed mb-8">
                        We believe that hands-on experience is the best teacher. Our mission is to democratize financial education
                        by providing accessible, engaging, and realistic market simulations that prepare participants for real-world trading.
                    </p>
                    <p className="text-lg text-gray-400 leading-relaxed">
                        Through competitive challenges and collaborative learning, we foster a community of informed traders who
                        understand market dynamics, risk management, and investment strategies.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default MissionSection;
