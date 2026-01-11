import React, { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, TrendingUp, Users, Shield, Target, CheckCircle, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const LandingPage = () => {
    useLayoutEffect(() => {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <LandingNavbar />
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <MissionSection />
            <ProcessSection />
            <TestimonialsSection />
            <ContactSection />
            <FooterSection />
        </div>
    );
};

// Navbar Component
const LandingNavbar = () => {
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '#about', label: 'About' },
        { href: '#features', label: 'Features' },
        { href: '#mission', label: 'Mission' },
        { href: '#process', label: 'Process' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/80 backdrop-blur-xl shadow-lg border-b border-green-500/20' : 'bg-transparent'
            }`}>
            <div className="container mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="text-3xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-green-500" size={32} />
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                            Delta
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map(link => (
                            <a
                                key={link.href}
                                href={link.href}
                                className="text-gray-300 hover:text-green-400 transition-colors font-medium"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            to="/login"
                            className="px-6 py-2.5 text-gray-300 hover:text-white transition-colors font-medium"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-full hover:from-green-400 hover:to-emerald-500 transition-all font-bold shadow-lg shadow-green-500/30"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        <div className="w-6 h-5 flex flex-col justify-between">
                            <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`w-full h-0.5 bg-white transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </div>
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-black/95 backdrop-blur-xl border-t border-green-500/20">
                        <div className="flex flex-col p-4 gap-4">
                            {navLinks.map(link => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    className="text-gray-300 hover:text-green-400 py-2 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="flex flex-col gap-3 pt-4 border-t border-gray-800">
                                <Link
                                    to="/login"
                                    className="text-center py-2.5 border border-green-500/30 rounded-full text-white hover:bg-green-500/10 transition-all"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="text-center py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-full font-bold"
                                >
                                    Get Started
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

// Hero Section
const HeroSection = () => {
    const heroRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.fromTo(
            titleRef.current.children,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.05 }
        )
            .fromTo(
                subtitleRef.current,
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.8 },
                '-=0.4'
            )
            .fromTo(
                ctaRef.current.children,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, stagger: 0.1 },
                '-=0.3'
            );

        // Floating animation for images
        gsap.to('.hero-float', {
            y: -20,
            duration: 3,
            ease: 'power1.inOut',
            yoyo: true,
            repeat: -1,
            stagger: 0.3,
        });
    }, { scope: heroRef });

    return (
        <section
            ref={heroRef}
            className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4 overflow-hidden"
        >
            {/* Background Images */}
            <div className="absolute inset-0 opacity-20">
                <img src="/images/1.jpeg" alt="" className="hero-float absolute top-20 left-10 w-40 h-40 object-cover rounded-2xl shadow-2xl" />
                <img src="/images/2.jpeg" alt="" className="hero-float absolute top-40 right-20 w-48 h-48 object-cover rounded-2xl shadow-2xl" />
                <img src="/images/3.jpeg" alt="" className="hero-float absolute bottom-40 left-20 w-36 h-36 object-cover rounded-2xl shadow-2xl" />
                <img src="/images/4.jpeg" alt="" className="hero-float absolute bottom-32 right-10 w-44 h-44 object-cover rounded-2xl shadow-2xl" />
            </div>

            {/* Gradient Background */}
            <div className="absolute inset-0">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 container mx-auto text-center max-w-5xl">
                {/* Main Title */}
                <h1
                    ref={titleRef}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
                >
                    {['Simulated', ' ', 'Stock', ' ', 'Market', ' ', 'Competitions'].map((word, i) => (
                        <span key={i} className="inline-block bg-gradient-to-r from-white via-green-200 to-emerald-300 bg-clip-text text-transparent">
                            {word}
                        </span>
                    ))}
                </h1>

                {/* Subtitle */}
                <p
                    ref={subtitleRef}
                    className="text-xl sm:text-2xl lg:text-3xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed"
                >
                    Experience immersive, personalized financial market simulations designed to educate and challenge participants
                </p>

                {/* CTA Buttons */}
                <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <a
                        href="#about"
                        className="group px-8 py-4 bg-white/10 backdrop-blur-sm border border-green-500/30 rounded-full text-lg font-medium hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        Learn More
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                    <Link
                        to="/signup"
                        className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-black rounded-full text-lg font-bold hover:from-green-400 hover:to-emerald-500 transition-all shadow-xl shadow-green-500/30"
                    >
                        Register New Participant
                    </Link>
                    <Link
                        to="/login"
                        className="px-8 py-4 border-2 border-green-500/50 rounded-full text-lg font-medium hover:border-green-400 transition-all"
                    >
                        Login Participant
                    </Link>
                </div>

                {/* Small Admin Link */}
                <div className="mt-6">
                    <a
                        href="#contact"
                        className="text-sm text-gray-500 hover:text-gray-400 underline underline-offset-4"
                    >
                        Contact for Administrator Login
                    </a>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center gap-12 mt-20 pt-8 border-t border-gray-800">
                    <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold text-green-400">10K+</div>
                        <div className="text-sm text-gray-400 mt-1">Active Participants</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold text-green-400">50+</div>
                        <div className="text-sm text-gray-400 mt-1">Competitions Run</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold text-green-400">$1M+</div>
                        <div className="text-sm text-gray-400 mt-1">Traded Volume</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

// About Section
const AboutSection = () => {
    const sectionRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(
            '.about-content',
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section id="about" ref={sectionRef} className="py-20 lg:py-32 px-4 relative">
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                </div>
            </div>
        </section>
    );
};

// Features Section
const FeaturesSection = () => {
    const features = [
        {
            icon: TrendingUp,
            title: 'Live Market Data',
            description: 'Real-time stock prices, charts, and market indicators for authentic trading experience.',
        },
        {
            icon: Users,
            title: 'Portfolio Management',
            description: 'Track your investments, analyze performance, and manage your virtual portfolio.',
        },
        {
            icon: Target,
            title: 'Competition Events',
            description: 'Participate in time-based competitions with specific rules and objectives.',
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

// Mission Section
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

// Process Section
const ProcessSection = () => {
    const steps = [
        {
            step: '01',
            title: 'Sign Up',
            description: 'Create your account and set up your trading profile in minutes.',
        },
        {
            step: '02',
            title: 'Join Competition',
            description: 'Browse active competitions and register for events that interest you.',
        },
        {
            step: '03',
            title: 'Start Trading',
            description: 'Execute trades, manage your portfolio, and implement your strategies.',
        },
        {
            step: '04',
            title: 'Track Progress',
            description: 'Monitor your performance on leaderboards and analyze your results.',
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

// Testimonials Section
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

// Contact Section
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

// Footer Section
const FooterSection = () => {
    return (
        <footer className="py-12 px-4 border-t border-gray-800">
            <div className="container mx-auto max-w-6xl">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="text-green-500" size={28} />
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

export default LandingPage;
