import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Label } from './Dock';
import FaultyTerminal from './FaultyTerminal';

const TOTALS = [
	{ value: '600+', label: 'Participants' },
	{ value: '10+', label: 'Competitions run' },
	{ value: '$16M+', label: 'Simulated volume' },
];

// Stable reference so the terminal's WebGL context isn't torn down on re-render.
const GRID_MUL = [2, 1];

/** A hairline the width of the board — the rule that separates two rows. */
const Rule = ({ strong = false }) => (
	<div
		aria-hidden="true"
		className={`relative z-10 h-px w-full ${strong ? 'bg-[#31D96A]/45' : 'bg-[#31D96A]/20'}`}
	/>
);

/** Matches the page's motion contract: the tube holds still when asked to. */
const usePrefersReducedMotion = () => {
	const [reduced, setReduced] = useState(
		() =>
			typeof window !== 'undefined' &&
			window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
	);
	useEffect(() => {
		const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
		if (!mq) return undefined;
		const onChange = (e) => setReduced(e.matches);
		mq.addEventListener?.('change', onChange);
		return () => mq.removeEventListener?.('change', onChange);
	}, []);
	return reduced;
};

/**
 * The first viewport.
 *
 * The board runs behind and through this section. The headline does not sit in
 * a hero card on top of it — it commandeers a row: same left gutter, same
 * symbol column, same rules above and below, blown up to display scale. The
 * stats read as a board TOTALS row rather than three marketing figures.
 *
 * The commandeered block no longer quiets the wall with flat ink — a
 * phosphor FaultyTerminal renders inside it, so the row glows on live tube.
 * A dark scrim and knockout text-shadows keep every line legible over it.
 */
const BoardHero = () => {
	const reduced = usePrefersReducedMotion();

	return (
		<section
			id="board"
			className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-10 pb-14"
		>
			{/* The commandeered block. The tube lives inside it; content sits on z-10.
			    Base ink stays as a fallback if WebGL is unavailable. */}
			<div className="relative overflow-hidden bg-[#050A07] shadow-[0_0_90px_30px_rgba(5,10,7,0.97)]">
				{/* Living background: dim, green-tinted, slow. Decorative only.
				    The wrapper owns the absolute positioning so the component's own
				    `.faulty-terminal-container { position: relative }` doesn't fight a
				    Tailwind `absolute` (equal specificity, its CSS loads later). */}
				<div aria-hidden="true" className="absolute inset-0 z-0">
					<FaultyTerminal
						scale={1.6}
						gridMul={GRID_MUL}
						digitSize={1.3}
						timeScale={0.35}
						pause={reduced}
						scanlineIntensity={0.5}
						glitchAmount={1}
						flickerAmount={0.6}
						noiseAmp={1}
						chromaticAberration={0}
						dither={0}
						curvature={0.1}
						tint="#31D96A"
						mouseReact={!reduced}
						mouseStrength={0.55}
						pageLoadAnimation={!reduced}
						brightness={0.45}
						resolutionScale={0.5}
						fps={30}
					/>
				</div>

				{/* Readability scrim: lightest behind the display type, darker over the
				    rows of small copy below, and dark at the edges to meet the rules. */}
				<div
					aria-hidden="true"
					className="absolute inset-0 z-[1]"
					style={{
						background:
							'linear-gradient(to bottom, rgba(5,10,7,0.86) 0%, rgba(5,10,7,0.40) 16%, rgba(5,10,7,0.46) 40%, rgba(5,10,7,0.72) 60%, rgba(5,10,7,0.88) 100%)',
					}}
				/>

				<Rule strong />

				<div className="relative z-10 px-3 sm:px-6">
					<div className="mx-auto max-w-[1560px]">
						{/* Column header, exactly as the wall labels its own rows */}
						<div className="flex items-baseline gap-4 py-2">
							<Label className="on-tube w-[3.6rem] shrink-0">Sym</Label>
							<Label className="on-tube">Instrument</Label>
						</div>
					</div>
				</div>

				<Rule />

				{/* THE ROW */}
				<div className="relative z-10 px-3 sm:px-6">
					<div className="mx-auto flex max-w-[1560px] flex-col gap-2 py-6 sm:flex-row sm:items-start sm:gap-6 lg:gap-10">
						<span className="font-board text-[26px] leading-none tracking-cell text-[#31D96A] bloom-tube sm:w-[3.6rem] sm:shrink-0 sm:pt-3 sm:text-[22px]">
							DELTA
						</span>
						<h1 className="font-board lg:text-[15vw] text-[8vw] font-medium uppercase leading-[0.86] tracking-cell text-[#31D96A] bloom-tube sm:text-[9.5vw] lg:text-[7.6vw] xl:text-[6.9rem]">
							Simulated
							<br />
							Stock Market
							<br />
							Competitions
						</h1>
					</div>
				</div>

				<Rule />

				{/* The mechanism, stated in one row */}
				<div className="relative z-10 px-3 sm:px-6">
					<div className="mx-auto max-w-[1560px] py-5">
						<div className="flex gap-4">
							<span aria-hidden="true" className="mt-1 w-1 shrink-0 self-stretch bg-[#22D3EE]" />
							<p className="on-tube max-w-[62ch] font-term text-[13px] leading-relaxed text-[#A8E6BF] sm:text-[15px]">
								Your instructor builds the market. They create the stocks, set the prices, and
								publish the news. Participants trade it live and find out what actually moves a
								price.
							</p>
						</div>
					</div>
				</div>

				<Rule />

				{/* Actions */}
				<div className="relative z-10 px-3 sm:px-6">
					<div className="mx-auto max-w-[1560px] py-4">
						<div className="flex flex-wrap items-center gap-3">
							<Link
								to="/signup"
								className="flex items-center gap-2 bg-[#31D96A] px-5 py-3 font-term text-[11px] font-bold uppercase tracking-label text-[#050A07] shadow-[0_2px_14px_-2px_rgba(0,0,0,0.65)] transition-colors hover:bg-[#A8E6BF]"
							>
								Register as participant
								<span aria-hidden="true" className="font-board text-[15px]">
									&gt;
								</span>
							</Link>
							<a
								href="#mechanism"
								className="on-tube flex items-center gap-2 border border-[#31D96A]/45 bg-[#050A07]/40 px-5 py-3 font-term text-[11px] uppercase tracking-label text-[#A8E6BF] backdrop-blur-[1px] transition-colors hover:bg-[#31D96A]/12 hover:border-[#31D96A]"
							>
								See how it works
								<span aria-hidden="true" className="font-board text-[15px]">
									v
								</span>
							</a>
							<a
								href="#contact"
								className="on-tube font-term text-[10px] uppercase tracking-label text-[#1FA8C4] underline decoration-[#1FA8C4]/50 underline-offset-4 transition-colors hover:text-[#22D3EE]"
							>
								Administrators: contact the organizers
							</a>
						</div>
					</div>
				</div>

				<Rule />

				{/* TOTALS — the stats as a board total line, dated. */}
				<div className="relative z-10 px-3 sm:px-6">
					<div className="mx-auto max-w-[1560px]">
						<div className="flex flex-wrap items-end gap-x-8 gap-y-3 py-4 sm:gap-x-14">
							<Label tone="phosphor" className="on-tube w-[3.6rem] shrink-0 pb-1">
								Totals
							</Label>
							{TOTALS.map((t) => (
								<div key={t.label} className="flex items-end gap-2.5">
									<span className="font-board text-[30px] leading-none tracking-cell text-[#A8E6BF] bloom-soft-tube tabular-nums sm:text-[38px]">
										{t.value}
									</span>
									<Label className="on-tube pb-1">{t.label}</Label>
								</div>
							))}
							<Label className="on-tube ml-auto pb-1">As of March 2026</Label>
						</div>
					</div>
				</div>

				<Rule strong />
			</div>

			{/* Board caption — the wall behind is authored demonstration material. */}
			<div className="px-3 sm:px-6 pt-3">
				<div className="mx-auto max-w-[1560px]">
					<Label>The market data behind this page is simulated.</Label>
				</div>
			</div>
		</section>
	);
};

export default BoardHero;
