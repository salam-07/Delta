import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BOARD_TICKERS, tickRow, money, signed } from './terminalData';

const ROW_H = 34; // px — one board row, the page's baseline unit
const prefersReduced = () =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * The Big Board.
 *
 * A fixed, full-bleed quote wall that sits behind the entire page. Content
 * panels dock over it, so the market never stops moving under the argument.
 * Decorative by role — the real content lives in the panels — so the whole
 * wall is hidden from assistive technology rather than read as a churning
 * table of numbers nobody asked for.
 */
const BigBoard = () => {
	const [rowCount, setRowCount] = useState(24);
	const [rows, setRows] = useState(() => BOARD_TICKERS.map((t, i) => ({ ...t, flip: i })));
	const reduced = useRef(prefersReduced());

	// Fill whatever viewport we're given, plus a row of bleed top and bottom.
	useEffect(() => {
		const measure = () => setRowCount(Math.ceil(window.innerHeight / ROW_H) + 2);
		measure();
		window.addEventListener('resize', measure);
		return () => window.removeEventListener('resize', measure);
	}, []);

	// Authored markets move when the administrator moves them; between updates
	// they drift. Two or three instruments reprice per tick, never the whole wall.
	useEffect(() => {
		if (reduced.current) return;
		const id = setInterval(() => {
			setRows((prev) => {
				const next = [...prev];
				const hits = 2 + Math.floor(Math.random() * 2);
				for (let i = 0; i < hits; i += 1) {
					const at = Math.floor(Math.random() * next.length);
					next[at] = tickRow(next[at]);
				}
				return next;
			});
		}, 1100);
		return () => clearInterval(id);
	}, []);

	const painted = useMemo(
		() => Array.from({ length: rowCount }, (_, i) => rows[i % rows.length]),
		[rowCount, rows]
	);

	return (
		<div
			aria-hidden="true"
			className="fixed inset-0 z-0 overflow-hidden crt-glass select-none"
			style={{ backgroundColor: '#050A07' }}
		>
			<div className="crt-sweep" />

			{/* Aperture-grille verticals — the wall is a physical panel, not a page */}
			<div
				className="absolute inset-0 z-10 opacity-[0.55]"
				style={{
					backgroundImage:
						'repeating-linear-gradient(to right, transparent 0 calc(100%/8 - 1px), rgba(49, 217, 106,0.09) calc(100%/8 - 1px), rgba(49, 217, 106,0.09) calc(100%/8))',
				}}
			/>

			<div className="relative z-20 opacity-[0.46]">
				{painted.map((r, i) => (
					<div
						key={`${r.sym}-${i}`}
						className="board-row grid items-center px-3 sm:px-6 font-term text-[11px] sm:text-xs tabular-nums"
						style={{
							height: ROW_H,
							gridTemplateColumns: 'minmax(3.6rem,auto) 1fr minmax(5rem,auto) minmax(4.5rem,auto)',
						}}
					>
						<span className="font-board text-[15px] sm:text-[17px] tracking-cell text-[#31D96A]">
							{r.sym}
						</span>
						<span className="hidden md:block truncate pl-4 text-[10px] uppercase tracking-label text-[#1C5C38]">
							{r.name}
						</span>
						<span className="md:hidden" />
						<span key={`p${r.flip}`} className="cell cell-flip text-right text-[#A8E6BF]">
							{money(r.price)}
						</span>
						<span
							key={`c${r.flip}`}
							className={`cell cell-flip text-right ${
								r.chg >= 0 ? 'text-[#5BFF8F]' : 'text-[#FF4136]'
							}`}
						>
							<span className="hidden sm:inline">{signed(r.chg)}</span>
							<span className="sm:hidden">{r.chg >= 0 ? '+' : '−'}</span>
						</span>
					</div>
				))}
			</div>
		</div>
	);
};

export default BigBoard;
