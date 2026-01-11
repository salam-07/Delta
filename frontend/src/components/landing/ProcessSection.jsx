import React from 'react';

const ProcessSection = () => {
    const steps = [
        {
            step: '01',
            title: 'Contact Us',
            description: 'Get in touch for your personalized competition structure.',
        },
        {
            step: '02',
            title: 'Register Participants',
            description: 'Register your participants, giving each user an intitial simulated wealth.',
        },
        {
            step: '03',
            title: 'Start Trading',
            description: 'Execute trades, manage portfolios, and implement strategies.',
        },
        {
            step: '04',
            title: 'Track Progress',
            description: 'Admins can monitor performance on leaderboards and analyze results.',
        },
    ];

    return (
        <section id="process" className="py-20 lg:py-32 px-4 bg-gradient-to-b from-green-950/20 to-black">
            <div className="container mx-auto max-w-6xl">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-2 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-sm font-medium mb-4 text-green-400">
                        How It Works
                    </span>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        <span className="bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                            Get Started in 4 Steps
                        </span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="glass-card p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-green-500/20 text-center hover:border-green-500/40 transition-all"
                        >
                            <div className="text-6xl font-bold text-green-500/30 mb-4">{step.step}</div>
                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-gray-400">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProcessSection;
