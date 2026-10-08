import React from 'react';
import { Link } from 'react-router-dom';
import { Label } from './Dock';
import { REPO_URL } from './TerminalChrome';

const CHANNELS = [
	{ label: 'Email', value: 'abdussalamameen26@gmail.com', href: 'mailto:abdussalamameen26@gmail.com' },
	{ label: 'Phone', value: '+92 333 7298886', href: 'tel:+923337298886' },
	{ label: 'Location', value: 'Online, worldwide', href: null },
];

/**
 * The close: the old Contact and Footer sections merged.
 *
 * Inverted onto amber ground — the way a board flips a row to inverse for an
 * alert. After a full page of amber on black this is the page's one colour
 * climax, and it gives the scroll a real end instead of trailing off into
 * link columns.
 */
const CloseBlock = () => (
	<footer id="contact" className="relative z-10 scroll-mt-14 pt-24 sm:pt-32">
		<div className="px-3 sm:px-6">
			<div className="mx-auto max-w-[1560px]">
				{/* ---- Inverse row: contact ---- */}
				<div className="bg-[#31D96A] text-[#050A07]">
					<div className="flex items-stretch justify-between border-b border-[#050A07]/25">
						<span className="bg-[#050A07] px-3 py-1.5 font-term text-[10px] font-bold uppercase tracking-label text-[#31D96A]">
							F6 · Contact
						</span>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] lg:divide-x lg:divide-[#050A07]/20">
						<div className="p-5 sm:p-8 lg:p-10">
							<h2 className="font-board text-[11vw] uppercase leading-[0.88] tracking-cell sm:text-[4.2rem]">
								Run a
								<br />
								competition
							</h2>
							<p className="mt-5 max-w-[46ch] font-term text-[13.5px] leading-relaxed text-[#050A07]/85">
								Have questions? Want to organize a competition for your class or school? Get in
								touch and we&apos;ll set the market up with you.
							</p>

							<div className="mt-7 flex flex-wrap gap-3">
								<a
									href="mailto:abdussalamameen26@gmail.com"
									className="flex items-center gap-2 bg-[#050A07] px-5 py-3 font-term text-[11px] font-bold uppercase tracking-label text-[#31D96A] transition-colors hover:bg-[#101B14]"
								>
									Email the organizers
									<span aria-hidden="true" className="font-board text-[15px]">
										&gt;
									</span>
								</a>
								<a
									href={REPO_URL}
									target="_blank"
									rel="noreferrer noopener"
									className="flex items-center gap-2 border border-[#050A07]/45 px-5 py-3 font-term text-[11px] uppercase tracking-label text-[#050A07] transition-colors hover:bg-[#050A07]/10 hover:border-[#050A07]"
								>
									View the source code
									<span aria-hidden="true" className="font-board text-[15px]">
										&gt;
									</span>
								</a>
							</div>
						</div>

						<div className="border-t border-[#050A07]/20 p-5 sm:p-8 lg:border-t-0 lg:p-10">
							<dl>
								{CHANNELS.map((c) => (
									<div
										key={c.label}
										className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3 border-b border-[#050A07]/20 py-3.5 first:pt-0"
									>
										<dt className="font-term text-[10px] uppercase tracking-label text-[#050A07]/60">
											{c.label}
										</dt>
										<dd className="font-term text-[13px] break-words text-[#050A07]">
											{c.href ? (
												<a
													href={c.href}
													className="underline decoration-[#050A07]/35 underline-offset-4 transition-colors hover:decoration-[#050A07]"
												>
													{c.value}
												</a>
											) : (
												c.value
											)}
										</dd>
									</div>
								))}
								<div className="grid grid-cols-[5.5rem_1fr] items-baseline gap-3 border-b border-[#050A07]/20 py-3.5">
									<dt className="font-term text-[10px] uppercase tracking-label text-[#050A07]/60">
										Source
									</dt>
									<dd className="font-term text-[13px] break-all text-[#050A07]">
										<a
											href={REPO_URL}
											target="_blank"
											rel="noreferrer noopener"
											className="underline decoration-[#050A07]/35 underline-offset-4 transition-colors hover:decoration-[#050A07]"
										>
											github.com/salam-07/Delta
										</a>
									</dd>
								</div>
							</dl>

							<p className="mt-5 border border-[#050A07]/40 p-3 font-term text-[11.5px] leading-relaxed text-[#050A07]/80">
								Administrator accounts are set up by the organizers. There is no public
								admin signup. Participants can register themselves.
							</p>
						</div>
					</div>
				</div>

				{/* ---- Sign-off ---- */}
				<div className="mt-3 dock">
					<div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#31D96A]/20 px-5 py-4 sm:px-8">
						<img src="/logo.svg" alt="" className="h-4 w-4" />
						<span className="font-board text-[18px] tracking-cell text-[#31D96A]">DELTA</span>
						<p className="font-term text-[11.5px] text-[#A8E6BF]/70">
							Simulated stock market competitions for classrooms and schools.
						</p>

						<nav aria-label="Page sections" className="ml-auto flex flex-wrap gap-x-5 gap-y-2">
							{[
								{ label: 'Board', href: '#board' },
								{ label: 'System', href: '#system' },
								{ label: 'Mechanism', href: '#mechanism' },
								{ label: 'Access', href: '#access' },
								{ label: 'Comment', href: '#comment' },
							].map((l) => (
								<a
									key={l.href}
									href={l.href}
									className="font-term text-[10px] uppercase tracking-label text-[#4FAE79] transition-colors hover:text-[#A8E6BF]"
								>
									{l.label}
								</a>
							))}
						</nav>
					</div>

					<div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3.5 sm:px-8">
						<Label>© 2026 Delta. All rights reserved.</Label>
						<Label>Virtual money only. No real funds and no real market data.</Label>
						<div className="ml-auto flex items-center gap-4">
							<Link
								to="/login"
								className="font-term text-[10px] uppercase tracking-label text-[#4FAE79] transition-colors hover:text-[#A8E6BF]"
							>
								Log in
							</Link>
							<Link
								to="/signup"
								className="font-term text-[10px] font-bold uppercase tracking-label text-[#31D96A] transition-colors hover:text-[#A8E6BF]"
							>
								Register
							</Link>
						</div>
					</div>
				</div>

				{/* The tape runs out. */}
				<div className="flex items-center gap-4 py-8">
					<span aria-hidden="true" className="h-px flex-1 bg-[#31D96A]/25" />
					<span aria-hidden="true" className="h-px flex-1 bg-[#31D96A]/25" />
				</div>
			</div>
		</div>
	</footer>
);

export default CloseBlock;
