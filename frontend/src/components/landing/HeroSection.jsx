import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Initial animations
        tl.fromTo('.hero-grid-line',
            { scaleY: 0, opacity: 0 },
            { scaleY: 1, opacity: 1, duration: 1.5, stagger: 0.1 }
        )
            .fromTo('.hero-badge',
                { y: -20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6 },
                '-=1'
            )
            .fromTo(
                titleRef.current.querySelectorAll('.title-word'),
                { y: 120, opacity: 0, rotateX: -80 },
                { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.08 },
                '-=0.8'
            )
            .fromTo(
                subtitleRef.current,
                { y: 40, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.6'
            )
            .fromTo(
                ctaRef.current.children,
                { y: 30, opacity: 0, scale: 0.9 },
                { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 },
                '-=0.4'
            )
            .fromTo('.hero-stat',
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
                '-=0.4'
            )
            .fromTo('.hero-glow',
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 2 },
                '-=1.5'
            )
            .fromTo('.marquee-row',
                { opacity: 0, y: 50 },
                { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
                '-=1.5'
            );

        // Rotating glow animation
        gsap.to('.hero-glow-rotate', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'none',
        });

        // Pulsing animation for particles
        gsap.to('.hero-particle', {
            scale: 1.5,
            opacity: 0.3,
            duration: 2,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            stagger: { each: 0.3, from: 'random' },
        });
    }, { scope: heroRef });

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden"
        >
            {/* Animated Grid Background */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                {[...Array(8)].map((_, i) => (
                    <div
                        key={i}
                        className="hero-grid-line absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-green-500/20 to-transparent origin-top"
                        style={{ left: `${12.5 * (i + 1)}%` }}
                    />
                ))}
            </div>

            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="hero-particle absolute w-1 h-1 bg-green-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: 0.4,
                        }}
                    />
                ))}
            </div>

            {/* Gradient Glows */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="hero-glow absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px]"></div>
                <div className="hero-glow absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/15 rounded-full blur-[100px]"></div>
                <div className="hero-glow hero-glow-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-conic from-green-500/10 via-transparent to-green-500/10 rounded-full blur-[80px]"></div>
            </div>

            {/* Infinite Scrolling Image Marquee */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex flex-col justify-center" style={{ transform: 'translateY(-15%)' }}>
                {/* 3D Perspective Container */}
                <div className="relative w-full" style={{ perspective: '1000px' }}>
                    <div className="transform" style={{ transform: 'rotateX(15deg) rotateZ(-3deg)', transformOrigin: 'center center' }}>

                        {/* Row 1 - Scrolling Left */}
                        <div className="marquee-row relative flex gap-4 mb-4 overflow-hidden">
                            <div className="flex gap-4 animate-marquee-left">
                                {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 animate-marquee-left" aria-hidden="true">
                                {[1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 2 - Scrolling Right */}
                        <div className="marquee-row relative flex gap-4 mb-4 overflow-hidden">
                            <div className="flex gap-4 animate-marquee-right">
                                {[4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 animate-marquee-right" aria-hidden="true">
                                {[4, 5, 6, 1, 2, 3, 4, 5, 6, 1, 2, 3].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Row 3 - Scrolling Left (slower) */}
                        <div className="marquee-row relative flex gap-4 overflow-hidden">
                            <div className="flex gap-4 animate-marquee-left-slow">
                                {[2, 4, 6, 1, 3, 5, 2, 4, 6, 1, 3, 5].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-4 animate-marquee-left-slow" aria-hidden="true">
                                {[2, 4, 6, 1, 3, 5, 2, 4, 6, 1, 3, 5].map((num, i) => (
                                    <div key={i} className="flex-shrink-0 w-48 h-32 md:w-64 md:h-44 lg:w-80 lg:h-52 rounded-xl overflow-hidden border border-green-500/20 shadow-2xl shadow-green-500/10">
                                        <img src={`/images/${num}.jpeg`} alt="" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gradient overlays for depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-black"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.95)_100%)]"></div>

                {/* Green glow on images */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/5"></div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 container mx-auto text-center max-w-5xl">
                {/* Badge */}
                <div className="hero-badge inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-green-500/10 backdrop-blur-md border border-green-500/30 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-sm font-medium text-green-300">Live Trading Simulation Platform</span>
                </div>

                {/* Main Title with 3D effect */}
                <h1
                    ref={titleRef}
                    className="mb-8 leading-tight perspective-1000"
                >
                    <div className="overflow-hidden py-2">
                        <span className="title-word inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
                            Simulated
                        </span>
                    </div>
                    <div className="overflow-hidden py-2">
                        <span className="title-word inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-r from-green-300 via-emerald-400 to-green-300 bg-clip-text text-transparent drop-shadow-2xl">
                            Stock Market
                        </span>
                    </div>
                    <div className="overflow-hidden py-2">
                        <span className="title-word inline-block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
                            Competitions
                        </span>
                    </div>
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                    Experience immersive, personalized financial market simulations designed to{' '}
                    <span className="text-green-400 font-semibold">educate</span>,{' '}
                    <span className="text-emerald-400 font-semibold">challenge</span>, and{' '}
                    <span className="text-green-300 font-semibold">inspire</span> the next generation of traders
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <a
                        href="#about"
                        className="group relative px-8 py-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-full text-lg font-medium overflow-hidden transition-all hover:border-green-500/50"
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            Learn More
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </a>
                    <Link
                        to="/signup"
                        className="group relative px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-black rounded-full text-lg font-bold overflow-hidden shadow-2xl shadow-green-500/40 hover:shadow-green-500/60 transition-all hover:scale-105"
                    >
                        <span className="relative z-10">Register New Participant</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                    <Link
                        to="/login"
                        className="group relative px-8 py-4 border-2 border-green-500/50 rounded-full text-lg font-medium overflow-hidden transition-all hover:border-green-400"
                    >
                        <span className="relative z-10">Login Participant</span>
                        <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </Link>
                </div>

                {/* Small Admin Link */}
                <div className="mt-6">
                    <a
                        href="#contact"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-400 transition-colors"
                    >
                        <span className="w-4 h-px bg-gray-600"></span>
                        Contact for Administrator Login
                        <span className="w-4 h-px bg-gray-600"></span>
                    </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16 mt-20 pt-10 border-t border-gray-800/50">
                    <div className="hero-stat text-center group cursor-default">
                        <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">10K+</div>
                        <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Active Participants</div>
                    </div>
                    <div className="hero-stat text-center group cursor-default">
                        <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">50+</div>
                        <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Competitions Run</div>
                    </div>
                    <div className="hero-stat text-center group cursor-default">
                        <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:scale-110 transition-transform">$1M+</div>
                        <div className="text-sm text-gray-400 mt-2 uppercase tracking-wider">Simulated Volume</div>
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
        </section>
    );
};

export default HeroSection;
