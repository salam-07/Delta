import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
    LandingNavbar,
    HeroSection,
    AboutSection,
    FeaturesSection,
    MissionSection,
    ProcessSection,
    PricingSection,
    TestimonialsSection,
    ContactSection,
    FooterSection
} from '../components/landing';

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
            <PricingSection />
            <TestimonialsSection />
            <ContactSection />
            <FooterSection />
        </div>
    );
};

export default LandingPage;
