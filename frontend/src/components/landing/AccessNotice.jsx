import React from 'react';
import Dock, { Label } from './Dock';

/**
 * The old Pricing and Mission sections, folded into one notice.
 *
 * Every figure and commitment here is real and binding — Pay What You Can, the
 * $0 to unlimited range, the $1,000+ already donated, the grant funding. The
 * mission copy is the *why* underneath the price, so it reads as the reason for
 * a number rather than as a separate slab of sentiment.
 */
const AccessNotice = () => (
	<Dock
		id="access"
		tab="F4 · Access"
		meta="Price schedule"
		align="left"
		cols={10}
		className="pt-24 sm:pt-32"
		bodyClassName="px-0 py-0"
	>
		<div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] lg:divide-x lg:divide-[#31D96A]/20">
			{/* --- The price --- */}
			<div className="p-5 sm:p-8 lg:p-10">
				<Label tone="phosphor">Pricing</Label>
				<h2 className="mt-3 font-board text-[10vw] uppercase leading-[0.9] tracking-cell text-[#31D96A] bloom-soft sm:text-[3.9rem]">
					Pay what
					<br />
					you can
				</h2>

				<div className="mt-6 flex items-end gap-4 border-y border-[#31D96A]/30 py-4">
					<span className="font-term text-[38px] font-bold leading-none tabular-nums text-[#A8E6BF] sm:text-[52px]">
						$0
					</span>
					<span className="pb-1.5 font-term text-[24px] text-[#1C5C38]">
						to
					</span>
					<span className="font-term text-[38px] font-bold leading-none text-[#A8E6BF] sm:text-[52px]">
						$∞
					</span>
					<Label className="ml-auto pb-2">Per competition</Label>
				</div>

				<p className="mt-5 max-w-[54ch] font-term text-[13.5px] leading-relaxed text-[#A8E6BF]">
					Competitions cost whatever you can pay. Free is fine too. Financial education should be
					open to everyone.
				</p>

				<div className="mt-7 border-t border-[#31D96A]/20 pt-5">
					<Label>Why</Label>
					<p className="mt-3 max-w-[58ch] font-term text-[12.5px] leading-relaxed text-[#A8E6BF]/75">
						People learn markets best by trading in one. Our goal is to make financial education
						available to everyone, through realistic simulations that get participants ready for
						real markets.
					</p>
					<p className="mt-3 max-w-[58ch] font-term text-[12.5px] leading-relaxed text-[#A8E6BF]/75">
						Competitions and group learning help participants understand how markets move, how to
						manage risk, and how to build an investment strategy.
					</p>
				</div>
			</div>

			{/* --- Where the money goes --- */}
			<div className="border-t border-[#31D96A]/20 p-5 sm:p-8 lg:border-t-0 lg:p-10">
				<Label tone="phosphor">Where the money goes</Label>

				<div className="mt-4 flex items-end gap-3">
					<span className="font-board text-[46px] leading-none tracking-cell tabular-nums text-[#31D96A] bloom sm:text-[58px]">
						$1,000+
					</span>
					<Label className="pb-2">Donated</Label>
				</div>

				<ul className="mt-5 border-t border-[#31D96A]/25">
					{['Orphanages', 'Laptops for students'].map((item) => (
						<li
							key={item}
							className="flex items-baseline gap-3 border-b border-[#31D96A]/12 py-3 font-term text-[13px] text-[#A8E6BF]"
						>
							<span aria-hidden="true" className="font-board text-[15px] text-[#22D3EE]">
								&gt;
							</span>
							{item}
						</li>
					))}
				</ul>

				<p className="mt-5 font-term text-[12.5px] leading-relaxed text-[#A8E6BF]/75">
					We donate most of the grants we receive. The platform is partly grant-funded, which is
					what makes the fee optional in the first place.
				</p>

				<div className="mt-6 border border-[#22D3EE]/35 bg-[#22D3EE]/[0.06] p-4">
					<Label>Our promise</Label>
					<p className="mt-2 font-term text-[12px] leading-relaxed text-[#A8E6BF]/85">
						Access matters more than profit. Financial education should be within reach no matter
						what you can afford.
					</p>
				</div>
			</div>
		</div>
	</Dock>
);

export default AccessNotice;
