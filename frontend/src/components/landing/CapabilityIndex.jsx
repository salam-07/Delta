import React from 'react';
import Dock, { Label } from './Dock';

/**
 * Merged from the old About and Features sections, which were two four-card
 * grids saying nearly the same thing. Rendered as the terminal's own function
 * index — a dense numbered table beats eight cards for a reader who is skimming.
 */
const FUNCTIONS = [
	{
		code: '01',
		name: 'Real-time markets',
		detail: 'Prices and the overall market index update live while a competition is running.',
		who: 'Both',
	},
	{
		code: '02',
		name: 'Developments',
		detail:
			'News and current-affairs events the administrator publishes. Participants have to read them and react.',
		who: 'Both',
	},
	{
		code: '03',
		name: 'Full admin controls',
		detail: 'Create, update and delete stocks. Set and move prices. Write and publish developments.',
		who: 'Administrator',
	},
	{
		code: '04',
		name: 'Competition events',
		detail: 'Time-based competitions with their own rules, objectives and gamified rewards.',
		who: 'Both',
	},
	{
		code: '05',
		name: 'Portfolio management',
		detail: 'Track investments, analyze performance, and manage a virtual portfolio and cash balance.',
		who: 'Participant',
	},
	{
		code: '06',
		name: 'Trade history',
		detail: 'Complete transaction history with detailed analytics and performance metrics.',
		who: 'Both',
	},
	{
		code: '07',
		name: 'Analytics dashboard',
		detail: 'See where participants struggled, then teach from what they actually did.',
		who: 'Administrator',
	},
	{
		code: '08',
		name: 'Safe learning',
		detail: 'Virtual money only. No real funds, no real-market data, no way to lose anything.',
		who: 'Participant',
	},
];

const WHO_TONE = {
	Administrator: 'text-[#22D3EE] border-[#22D3EE]/40',
	Participant: 'text-[#31D96A] border-[#31D96A]/40',
	Both: 'text-[#4FAE79] border-[#4FAE79]/35',
};

const CapabilityIndex = () => (
	<Dock
		id="system"
		tab="F2 · System"
		meta="8 functions"
		align="right"
		cols={9}
		className="pt-24 sm:pt-32"
		bodyClassName="px-0 py-0"
	>
		<div className="px-5 pt-7 pb-5 sm:px-8 lg:px-10">
			<h2 className="font-board text-[7vw] uppercase leading-[0.92] tracking-cell text-[#31D96A] bloom-soft sm:text-[3.4rem]">
				What the
				<br />
				terminal does
			</h2>
			<p className="mt-5 max-w-[58ch] font-term text-[13px] leading-relaxed text-[#A8E6BF]/85">
				One market, two seats. The administrator authors it; the participants trade it. Everything
				below is in the product today.
			</p>
		</div>

		<ul className="border-t border-[#31D96A]/25">
			{FUNCTIONS.map((f) => (
				<li
					key={f.code}
					className="group grid grid-cols-[2.4rem_1fr] items-start gap-x-3 gap-y-1 border-b border-[#31D96A]/15 px-5 py-4 transition-colors last:border-b-0 hover:bg-[#31D96A]/[0.07] sm:grid-cols-[3rem_minmax(9rem,14rem)_1fr_auto] sm:items-baseline sm:gap-x-5 sm:px-8 lg:px-10"
				>
					<span className="font-board text-[17px] leading-none tracking-cell text-[#1C5C38] transition-colors group-hover:text-[#31D96A]">
						{f.code}
					</span>
					<h3 className="font-term text-[13px] font-bold uppercase tracking-label text-[#31D96A] sm:text-[12px]">
						{f.name}
					</h3>
					<p className="col-start-2 font-term text-[12.5px] leading-relaxed text-[#A8E6BF]/80 sm:col-start-3">
						{f.detail}
					</p>
					<span
						className={`col-start-2 mt-1 w-fit border px-2 py-0.5 font-term text-[9px] uppercase tracking-label sm:col-start-4 sm:mt-0 ${
							WHO_TONE[f.who]
						}`}
					>
						{f.who}
					</span>
				</li>
			))}
		</ul>

		<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#31D96A]/30 px-5 py-3 sm:px-8 lg:px-10">
			<Label>End of index</Label>
			<Label tone="phosphor">Web · React · Socket.io</Label>
		</div>
	</Dock>
);

export default CapabilityIndex;
