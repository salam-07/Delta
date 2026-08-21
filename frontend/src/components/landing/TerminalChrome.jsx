import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DEMO_INDEX, money } from './terminalData';

export const REPO_URL = 'https://github.com/salam-07/Delta';

const F_KEYS = [
	{ key: 'F1', label: 'BOARD', href: '#board' },
	{ key: 'F2', label: 'SYSTEM', href: '#system' },
	{ key: 'F3', label: 'MECHANISM', href: '#mechanism' },
	{ key: 'F4', label: 'ACCESS', href: '#access' },
	{ key: 'F5', label: 'COMMENT', href: '#comment' },
	{ key: 'F6', label: 'CONTACT', href: '#contact' },
];

const clock = () =>
	new Date().toLocaleTimeString('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
	});

/**
 * The terminal's persistent chrome: a status bar welded to the top of the glass
 * and a function-key rail along the bottom. The primary action (REGISTER) lives
 * in the rail, so it is on screen before the visitor scrolls a pixel and never
 * leaves.
 */
export const StatusBar = () => {
	const [now, setNow] = useState(clock);
	const drop = DEMO_INDEX.close - DEMO_INDEX.open;

	useEffect(() => {
		const id = setInterval(() => setNow(clock()), 1000);
		return () => clearInterval(id);
	}, []);

	return (
		<header className="fixed top-0 inset-x-0 z-40 h-10 border-b border-[#31D96A]/35 bg-[#050A07]/97 backdrop-blur-[2px]">
			<div className="flex h-full items-center gap-3 px-3 sm:px-5 font-term text-[10px] uppercase tracking-label">
				<img src="/logo.svg" alt="" className="h-4 w-4 shrink-0" />
				<span className="font-board text-[16px] tracking-cell text-[#31D96A] bloom">DELTA</span>
				<span className="hidden sm:inline text-[#1C5C38]">|</span>
				<span className="hidden sm:inline text-[#4FAE79]">Market Terminal</span>

				<div className="ml-auto flex items-center gap-3 sm:gap-5 tabular-nums">
					<span className="hidden md:flex items-baseline gap-2">
						<span className="text-[#1FA8C4]">Composite</span>
						<span className="text-[#A8E6BF]">{money(DEMO_INDEX.close)}</span>
						<span className="text-[#FF4136] bloom-down">
							{'−'}
							{Math.abs((drop / DEMO_INDEX.open) * 100).toFixed(2)}%
						</span>
					</span>
					<span className="flex items-center gap-1.5">
						<span className="lamp inline-block h-1.5 w-1.5 rounded-full bg-[#31D96A]" />
						<span className="text-[#4FAE79]">Sim</span>
					</span>
					<span className="text-[#A8E6BF]">{now}</span>
				</div>
			</div>
		</header>
	);
};

export const KeyRail = () => (
	<nav
		aria-label="Terminal function keys"
		className="fixed bottom-0 inset-x-0 z-40 h-14 border-t border-[#31D96A]/35 bg-[#050A07]/97 backdrop-blur-[2px]"
	>
		<div className="flex h-full items-stretch">
			<ul className="hidden lg:flex items-stretch">
				{F_KEYS.map((f) => (
					<li key={f.key} className="flex">
						<a
							href={f.href}
							className="group flex items-center gap-2 border-r border-[#31D96A]/20 px-4 font-term text-[10px] uppercase tracking-label text-[#4FAE79] transition-colors hover:bg-[#31D96A]/12 hover:text-[#A8E6BF]"
						>
							<span className="font-board text-[14px] tracking-cell text-[#1C5C38] transition-colors group-hover:text-[#31D96A]">
								{f.key}
							</span>
							{f.label}
						</a>
					</li>
				))}
			</ul>

			<div className="ml-auto flex items-stretch gap-px">
				<a
					href={REPO_URL}
					target="_blank"
					rel="noreferrer noopener"
					className="flex items-center gap-2 border-l border-[#31D96A]/20 px-3 sm:px-4 font-term text-[10px] uppercase tracking-label text-[#4FAE79] transition-colors hover:bg-[#31D96A]/12 hover:text-[#A8E6BF]"
				>
					<span className="font-board text-[14px] tracking-cell text-[#1C5C38]">F8</span>
					Source
				</a>
				<Link
					to="/login"
					className="flex items-center border-l border-[#31D96A]/20 px-3 sm:px-5 font-term text-[10px] uppercase tracking-label text-[#A8E6BF] transition-colors hover:bg-[#31D96A]/12"
				>
					Log in
				</Link>
				<Link
					to="/signup"
					className="flex items-center gap-2 bg-[#31D96A] px-4 sm:px-6 font-term text-[11px] font-bold uppercase tracking-label text-[#050A07] transition-colors hover:bg-[#A8E6BF]"
				>
					Register
					<span aria-hidden="true" className="font-board text-[15px]">
						&gt;
					</span>
				</Link>
			</div>
		</div>
	</nav>
);
