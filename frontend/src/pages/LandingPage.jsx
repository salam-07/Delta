import React, { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
    BigBoard,
    StatusBar,
    KeyRail,
    BoardHero,
    CapabilityIndex,
    MechanismDemo,
    AccessNotice,
    CommentWire,
    CloseBlock
} from '../components/landing';

gsap.registerPlugin(ScrollTrigger);

/**
 * The Delta landing page: one continuous trading terminal.
 *
 * The Big Board is a single fixed quote wall that runs behind the entire
 * document; every section is a panel docked over it, offset so the wall stays
 * visible alongside. The chrome (status bar, function-key rail) is welded to
 * the glass, so REGISTER is on screen from the first pixel to the last.
 *
 * See the direction contract at the top of index.html.
 */
const LandingPage = () => {
    useLayoutEffect(() => {
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';

        // Fonts and the floor photography settle after first paint; the demo's
        // trigger has to be measured against the final layout.
        const timeoutId = setTimeout(() => {
            ScrollTrigger.refresh(true);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="delta-term relative min-h-screen overflow-x-hidden pb-14">
            <BigBoard />
            <StatusBar />

            <main>
                <BoardHero />
                <CapabilityIndex />
                <MechanismDemo />
                <AccessNotice />
                <CommentWire />
                <CloseBlock />
            </main>

            <KeyRail />

            {/* The glass itself: scanlines, tube vignette, one slow refresh sweep.
                Viewport-locked and inert, above the chrome because the chrome is
                behind the same piece of glass. */}
            <div
                aria-hidden="true"
                className="crt-glass pointer-events-none fixed inset-0 z-50 overflow-hidden"
            >
                <div className="crt-sweep" />
            </div>
        </div>
    );
};

export default LandingPage;
