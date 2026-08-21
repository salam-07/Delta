import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from './Dock';

const TOTALS = [
	{ value: '600+', label: 'Participants' },
	{ value: '10+', label: 'Competitions run' },
	{ value: '$16M+', label: 'Simulated volume' },
];

/** A hairline the width of the board — the rule that separates two rows. */
const Rule = ({ strong = false }) => (
	<div
		aria-hidden="true"
		className={`h-px w-full ${strong ? 'bg-[#31D96A]/45' : 'bg-[#31D96A]/20'}`}
	/>
);

/**
 * The first viewport.
 *
 * The board runs behind and through this section. The headline does not sit in
 * a hero card on top of it — it commandeers a row: same left gutter, same
 * symbol column, same rules above and below, blown up to display scale. The
 * stats read as a board TOTALS row rather than three marketing figures.
 */
const BoardHero = () => (
	<section
		id="board"
		className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-10 pb-14"
	>
		{/* The commandeered block. Opaque, so the wall goes quiet inside it. */}
		<div className="relative bg-[#050A07]/[0.97] shadow-[0_0_90px_30px_rgba(5, 10, 7,0.97)]">
			<Rule strong />

			<div className="px-3 sm:px-6">
				<div className="mx-auto max-w-[1560px]">
					{/* Column header, exactly as the wall labels its own rows */}
					<div className="flex items-baseline gap-4 py-2">
						<Label className="w-[3.6rem] shrink-0">Sym</Label>
						<Label>Instrument</Label>
						<Label className="ml-auto">Row commandeered</Label>
					</div>
				</div>
			</div>

			<Rule />

			{/* THE ROW */}
			<div className="px-3 sm:px-6">
				<div className="mx-auto flex max-w-[1560px] flex-col gap-2 py-6 sm:flex-row sm:items-start sm:gap-6 lg:gap-10">
					<span className="font-board text-[26px] leading-none tracking-cell text-[#31D96A] bloom sm:w-[3.6rem] sm:shrink-0 sm:pt-3 sm:text-[22px]">
						DELTA
					</span>
					<h1 className="font-board text-[15vw] font-medium uppercase leading-[0.86] tracking-cell text-[#31D96A] bloom sm:text-[9.5vw] lg:text-[7.6vw] xl:text-[6.9rem]">
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
			<div className="px-3 sm:px-6">
				<div className="mx-auto max-w-[1560px] py-5">
					<div className="flex gap-4">
						<span aria-hidden="true" className="mt-1 w-1 shrink-0 self-stretch bg-[#22D3EE]" />
						<p className="max-w-[62ch] font-term text-[13px] leading-relaxed text-[#A8E6BF] sm:text-[15px]">
							Your instructor authors the market. They create the stocks, move the prices, and
							publish the news&nbsp;— participants trade it live and learn what actually moves a
							price.
						</p>
					</div>
				</div>
			</div>

			<Rule />

			{/* Actions */}
			<div className="px-3 sm:px-6">
				<div className="mx-auto max-w-[1560px] py-4">
					<div className="flex flex-wrap items-center gap-3">
						<Link
							to="/signup"
							className="flex items-center gap-2 bg-[#31D96A] px-5 py-3 font-term text-[11px] font-bold uppercase tracking-label text-[#050A07] transition-colors hover:bg-[#A8E6BF]"
						>
							Register as participant
							<span aria-hidden="true" className="font-board text-[15px]">
								&gt;
							</span>
						</Link>
						<a
							href="#mechanism"
							className="flex items-center gap-2 border border-[#31D96A]/45 px-5 py-3 font-term text-[11px] uppercase tracking-label text-[#A8E6BF] transition-colors hover:bg-[#31D96A]/12 hover:border-[#31D96A]"
						>
							Watch the mechanism
							<span aria-hidden="true" className="font-board text-[15px]">
								v
							</span>
						</a>
						<a
							href="#contact"
							className="font-term text-[10px] uppercase tracking-label text-[#1FA8C4] underline decoration-[#1FA8C4]/50 underline-offset-4 transition-colors hover:text-[#22D3EE]"
						>
							Administrator access — contact the organizers
						</a>
					</div>
				</div>
			</div>

			<Rule />

			{/* TOTALS — the stats as a board total line, dated. */}
			<div className="px-3 sm:px-6">
				<div className="mx-auto max-w-[1560px]">
					<div className="flex flex-wrap items-end gap-x-8 gap-y-3 py-4 sm:gap-x-14">
						<Label tone="phosphor" className="w-[3.6rem] shrink-0 pb-1">
							Totals
						</Label>
						{TOTALS.map((t) => (
							<div key={t.label} className="flex items-end gap-2.5">
								<span className="font-board text-[30px] leading-none tracking-cell text-[#A8E6BF] bloom-soft tabular-nums sm:text-[38px]">
									{t.value}
								</span>
								<Label className="pb-1">{t.label}</Label>
							</div>
						))}
						<Label className="ml-auto pb-1">As of 2026-03</Label>
					</div>
				</div>
			</div>

			<Rule strong />
		</div>

		{/* Board caption — the wall behind is authored demonstration material. */}
		<div className="px-3 sm:px-6 pt-3">
			<div className="mx-auto max-w-[1560px]">
				<Label>Wall behind: synthetic market data — demonstration</Label>
			</div>
		</div>
	</section>
);

export default BoardHero;
