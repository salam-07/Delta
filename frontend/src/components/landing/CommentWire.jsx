import React from 'react';
import { Label } from './Dock';

/**
 * The three real testimonials, set as wire COMMENT items with attributed
 * sources. Verbatim — these are binding content and must not drift.
 */
const COMMENTS = [
	{
		ref: 'C-001',
		quote:
			'Our school held a competition on Delta and it changed how I understand stock markets. The competitions are intense and educational!',
		name: 'Uzair',
		role: 'Finance Student',
		seat: 'Participant',
	},
	{
		ref: 'C-002',
		quote:
			'Students loved the series of stock markets we held in classes. This platform is brilliant for an introduction to not only stocks, but understanding current affairs and world news.',
		name: 'Ayesha',
		role: 'School Principal',
		seat: 'Organizer',
	},
	{
		ref: 'C-003',
		quote:
			'As an administrator of one of these events, I loved the analytics dashboard. I get to teach students where I have seen them lack in real markets.',
		name: 'Asim',
		role: 'Finance and Economics Professor',
		seat: 'Administrator',
	},
];

const CommentWire = () => (
	<section id="comment" className="relative z-10 scroll-mt-14 pt-24 sm:pt-32">
		{/* Two more frames of floor footage, dimmer than FIG. 1. */}
		<div aria-hidden="true" className="absolute inset-0 overflow-hidden">
			<div className="absolute inset-0 grid grid-cols-2 opacity-[0.22]">
				{[1, 6].map((n) => (
					<img
						key={n}
						src={`/images/${n}.jpeg`}
						alt=""
						loading="lazy"
						decoding="async"
						className="floor-photo h-full w-full object-cover"
					/>
				))}
			</div>
			<div className="absolute inset-0 floor-photo-tint" />
			<div
				className="absolute inset-0"
				style={{
					backgroundImage:
						'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.45) 3px 4px)',
				}}
			/>
		</div>

		<div className="relative px-3 sm:px-6">
			<div className="mx-auto max-w-[1560px]">
				<div className="grid grid-cols-1 lg:grid-cols-12">
					<div className="lg:col-span-3 lg:pr-8">
						<Label tone="phosphor">F5 · Comment</Label>
						<h2 className="mt-3 font-board text-[8vw] uppercase leading-[0.92] tracking-cell text-[#31D96A] bloom-soft sm:text-[2.6rem] lg:text-[2.3rem]">
							From the
							<br />
							desks
						</h2>
						<p className="mt-4 max-w-[36ch] font-term text-[12.5px] leading-relaxed text-[#A8E6BF]/75">
							Three sources, three seats: one who traded it, one who ran it for a school, one who
							administered a competition.
						</p>
					</div>

					<ul className="mt-8 lg:col-span-9 lg:mt-0">
						{COMMENTS.map((c) => (
							<li key={c.ref} className="dock mb-3 last:mb-0">
								<div className="flex flex-wrap items-stretch justify-between gap-y-1 border-b border-[#31D96A]/30">
									<span className="flex items-center gap-3 px-3 py-1.5">
										<span className="font-board text-[14px] tracking-cell text-[#31D96A]">
											{c.ref}
										</span>
										<Label>Comment</Label>
									</span>
									<span className="flex items-center px-3 py-1.5">
										<span className="border border-[#22D3EE]/40 px-2 py-0.5 font-term text-[9px] uppercase tracking-label text-[#22D3EE]">
											{c.seat}
										</span>
									</span>
								</div>
								<blockquote className="p-5 sm:p-7">
									<p className="max-w-[72ch] font-term text-[14px] leading-relaxed text-[#A8E6BF] sm:text-[15px]">
										{c.quote}
									</p>
									<footer className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-t border-[#31D96A]/20 pt-3">
										<cite className="not-italic font-board text-[19px] tracking-cell text-[#31D96A]">
											{c.name}
										</cite>
										<Label>{c.role}</Label>
									</footer>
								</blockquote>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	</section>
);

export default CommentWire;
