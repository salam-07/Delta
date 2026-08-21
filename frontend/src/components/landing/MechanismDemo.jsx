import React, { useCallback, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Label } from './Dock';
import {
	DEMO_STEPS,
	DEMO_TICKERS,
	DEMO_DEVELOPMENT,
	DEMO_FILLS,
	DEMO_STANDINGS_OPEN,
	DEMO_STANDINGS_CLOSE,
	DEMO_INDEX,
	money,
} from './terminalData';

gsap.registerPlugin(ScrollTrigger);

const FLOOR_PHOTOS = [3, 5, 2, 7, 4];

const reducedMotion = () =>
	typeof window !== 'undefined' &&
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * FIG. 1 — the mechanism, dramatized.
 *
 * A four-act scripted loop matching Delta's four real onboarding steps. It runs
 * itself once when scrolled into view, then rests; nothing here is clickable
 * except REPLAY. Act three is the whole argument: an administrator publishes a
 * Development, and the market visibly reacts to news that a human wrote.
 *
 * Every number is deterministic and labelled synthetic. Behind the panel are
 * real photographs of participants using Delta, treated as floor footage —
 * legible as people at screens, never competing with the panel text.
 */
const MechanismDemo = () => {
	const root = useRef(null);
	const tl = useRef(null);
	const [act, setAct] = useState(-1);
	const [fills, setFills] = useState(0);

	const priced = act >= 2;
	const settled = act >= 3;

	const run = useCallback(() => {
		tl.current?.kill();
		setFills(0);
		const t = gsap.timeline();
		t.call(() => setAct(0), null, 0)
			.call(() => setAct(1), null, 2.2)
			.call(() => setAct(2), null, 4.5)
			.call(() => setFills(1), null, 5.4)
			.call(() => setFills(2), null, 6.1)
			.call(() => setFills(3), null, 6.9)
			.call(() => setAct(3), null, 8.8);
		tl.current = t;
	}, []);

	useGSAP(
		() => {
			if (reducedMotion()) {
				setAct(3);
				setFills(3);
				return;
			}
			ScrollTrigger.create({
				trigger: root.current,
				start: 'top 72%',
				once: true,
				onEnter: run,
			});
			return () => tl.current?.kill();
		},
		{ scope: root }
	);

	const standings = settled ? DEMO_STANDINGS_CLOSE : DEMO_STANDINGS_OPEN;
	const indexValue = priced ? DEMO_INDEX.close : DEMO_INDEX.open;
	const indexDelta = DEMO_INDEX.close - DEMO_INDEX.open;

	return (
		<section id="mechanism" ref={root} className="relative z-10 scroll-mt-14 pt-24 sm:pt-32">
			{/* Floor footage: real participants, treated so they sit under the panel. */}
			<div aria-hidden="true" className="absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 grid grid-cols-3 lg:grid-cols-5 opacity-[0.34]">
					{FLOOR_PHOTOS.map((n) => (
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
							'repeating-linear-gradient(to bottom, rgba(0,0,0,0) 0 2px, rgba(0,0,0,0.42) 3px 4px)',
					}}
				/>
			</div>

			<div className="relative px-3 sm:px-6">
				<div className="mx-auto max-w-[1560px]">
					<div className="max-w-[46ch] pb-6">
						<Label tone="phosphor">Fig. 1 — the mechanism</Label>
						<h2 className="mt-3 font-board text-[8vw] uppercase leading-[0.92] tracking-cell text-[#31D96A] bloom-soft sm:text-[3.6rem]">
							Watch an instructor move the market
						</h2>
						<p className="mt-4 font-term text-[13px] leading-relaxed text-[#A8E6BF]/85">
							A public-market simulator mirrors real tickers, so nothing in it was written to
							teach anything. Delta&apos;s market is authored. Here is one competition, in four
							steps.
						</p>
					</div>

					{/* ---------------- The instrument panel ---------------- */}
					<div className="dock dock-ticks">
						<div className="flex flex-wrap items-stretch justify-between gap-y-1 border-b border-[#31D96A]/38">
							<span className="dock-tab px-3 py-1.5 font-term text-[10px] font-bold uppercase tracking-label">
								F3 · Mechanism
							</span>
							<div className="flex items-center gap-4 px-3 py-1.5">
								<Label>Synthetic demonstration data</Label>
								<button
									type="button"
									onClick={run}
									className="group flex items-center gap-1.5 border border-[#31D96A]/40 px-2 py-0.5 font-term text-[9px] uppercase tracking-label text-[#4FAE79] transition-colors hover:bg-[#31D96A]/15 hover:text-[#A8E6BF]"
								>
									<span aria-hidden="true" className="font-board text-[12px]">
										F6
									</span>
									Replay
								</button>
							</div>
						</div>

						<div className="grid grid-cols-1 divide-y divide-[#31D96A]/15 lg:grid-cols-[1.05fr_0.95fr_1fr] lg:divide-x lg:divide-y-0">
							{/* --- Developments wire --- */}
							<div className="p-4 sm:p-5">
								<div className="flex items-center justify-between pb-3">
									<Label>Developments</Label>
									<Label tone="phosphor">{priced ? '1 unread' : 'Standing by'}</Label>
								</div>

								<div
									className={`border border-dashed p-3 transition-all duration-700 ${
										priced
											? 'translate-y-0 border-[#FF4136]/55 bg-[#FF4136]/[0.07] opacity-100'
											: 'translate-y-2 border-[#31D96A]/20 opacity-25'
									}`}
								>
									{priced ? (
										<>
											<div className="flex flex-wrap items-center gap-2 pb-2">
												<span className="bg-[#FF4136] px-1.5 py-0.5 font-term text-[9px] font-bold uppercase tracking-label text-[#050A07]">
													{DEMO_DEVELOPMENT.priority}
												</span>
												<Label tone="phosphor">{DEMO_DEVELOPMENT.slug}</Label>
												<Label>{DEMO_DEVELOPMENT.stamp}</Label>
											</div>
											<h3 className="font-term text-[13px] font-bold uppercase leading-snug tracking-wide text-[#A8E6BF]">
												{DEMO_DEVELOPMENT.headline}
												{act === 2 && (
													<span
														aria-hidden="true"
														className="lamp ml-1 inline-block h-[1em] w-[0.5em] translate-y-[0.12em] bg-[#31D96A]"
													/>
												)}
											</h3>
											<p className="mt-2 font-term text-[11.5px] leading-relaxed text-[#A8E6BF]/70">
												{DEMO_DEVELOPMENT.body}
											</p>
											<div className="mt-3 border-t border-[#31D96A]/20 pt-2">
												<Label>Published by {DEMO_DEVELOPMENT.author}</Label>
											</div>
										</>
									) : (
										<p className="py-6 text-center font-term text-[11px] uppercase tracking-label text-[#1C5C38]">
											No developments published
										</p>
									)}
								</div>

								<dl className="mt-4 space-y-2 border-t border-[#31D96A]/20 pt-3">
									<div className="flex items-baseline justify-between gap-3">
										<dt>
											<Label>Participants</Label>
										</dt>
										<dd className="font-board text-[19px] leading-none tracking-cell tabular-nums text-[#A8E6BF]">
											{act >= 1 ? '128' : '—'}
										</dd>
									</div>
									<div className="flex items-baseline justify-between gap-3">
										<dt>
											<Label>Opening balance each</Label>
										</dt>
										<dd className="font-board text-[19px] leading-none tracking-cell tabular-nums text-[#A8E6BF]">
											{act >= 1 ? '$100,000' : '—'}
										</dd>
									</div>
								</dl>
							</div>

							{/* --- Market --- */}
							<div className="p-4 sm:p-5">
								<div className="flex items-center justify-between pb-3">
									<Label>Market</Label>
									<Label tone="phosphor">{priced ? 'Repriced' : 'At open'}</Label>
								</div>

								<div className="grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-3 border-b border-[#31D96A]/20 pb-1.5">
									<Label>Sym</Label>
									<Label>Sector</Label>
									<Label>Last</Label>
								</div>

								<ul>
									{DEMO_TICKERS.map((t, i) => {
										const value = priced ? t.close : t.open;
										const delta = t.close - t.open;
										return (
											<li
												key={t.sym}
												className="grid grid-cols-[3.2rem_1fr_auto] items-baseline gap-x-3 border-b border-[#31D96A]/10 py-2 last:border-b-0"
											>
												<span className="font-board text-[16px] leading-none tracking-cell text-[#31D96A]">
													{t.sym}
												</span>
												<span className="font-term text-[9.5px] uppercase tracking-label text-[#1C5C38]">
													{t.sector}
												</span>
												<span className="text-right tabular-nums">
													<span
														key={`${t.sym}-${priced}`}
														className="cell cell-flip block font-term text-[13px] text-[#A8E6BF]"
														style={{ animationDelay: `${i * 90}ms` }}
													>
														{money(value)}
													</span>
													<span
														className={`block font-term text-[10px] transition-opacity duration-500 ${
															priced ? 'opacity-100' : 'opacity-0'
														} ${delta >= 0 ? 'text-[#5BFF8F] bloom-up' : 'text-[#FF4136] bloom-down'}`}
													>
														{delta >= 0 ? '+' : '−'}
														{Math.abs((delta / t.open) * 100).toFixed(2)}%
													</span>
												</span>
											</li>
										);
									})}
								</ul>

								<div className="mt-3 flex items-end justify-between gap-3 border-t border-[#31D96A]/30 pt-3">
									<Label tone="phosphor">Delta composite</Label>
									<div className="text-right">
										<span
											key={`idx-${priced}`}
											className="cell cell-flip block font-board text-[24px] leading-none tracking-cell tabular-nums text-[#A8E6BF] bloom-soft"
										>
											{money(indexValue)}
										</span>
										<span
											className={`font-term text-[10px] transition-opacity duration-500 ${
												priced ? 'opacity-100 text-[#FF4136] bloom-down' : 'opacity-0'
											}`}
										>
											−{Math.abs((indexDelta / DEMO_INDEX.open) * 100).toFixed(2)}%
										</span>
									</div>
								</div>
							</div>

							{/* --- Blotter + standings --- */}
							<div className="p-4 sm:p-5">
								<div className="flex items-center justify-between pb-3">
									<Label>Blotter</Label>
									<Label tone="phosphor">{fills} filled</Label>
								</div>

								<ul className="min-h-[6.5rem]">
									{DEMO_FILLS.slice(0, fills).map((f) => (
										<li
											key={f.id + f.sym}
											className="grid grid-cols-[auto_auto_1fr_auto] items-baseline gap-x-2 border-b border-[#31D96A]/10 py-2 font-term text-[11.5px] tabular-nums"
										>
											<span className="text-[#1FA8C4]">{f.stamp}</span>
											<span
												className={`px-1 py-px text-[9px] font-bold uppercase tracking-label ${
													f.side === 'BUY'
														? 'bg-[#5BFF8F]/18 text-[#5BFF8F]'
														: 'bg-[#FF4136]/18 text-[#FF4136]'
												}`}
											>
												{f.side}
											</span>
											<span className="text-[#A8E6BF]/85">
												{f.qty} {f.sym}
											</span>
											<span className="text-[#A8E6BF]">@{f.at.toFixed(2)}</span>
										</li>
									))}
									{fills === 0 && (
										<li className="py-6 text-center font-term text-[11px] uppercase tracking-label text-[#1C5C38]">
											No fills
										</li>
									)}
								</ul>

								<div className="mt-3 border-t border-[#31D96A]/20 pt-3">
									<div className="flex items-center justify-between pb-2">
										<Label>Standings</Label>
										<Label tone="phosphor">{settled ? 'Settled' : 'Provisional'}</Label>
									</div>
									<ul>
										{standings.map((s, i) => (
											<li
												key={s.id}
												className="grid grid-cols-[1.4rem_1fr_auto] items-baseline gap-x-2 border-b border-[#31D96A]/10 py-1.5 font-term text-[11.5px] tabular-nums transition-all duration-500 last:border-b-0"
											>
												<span className="font-board text-[14px] tracking-cell text-[#1C5C38]">
													{i + 1}
												</span>
												<span className={i === 0 ? 'text-[#31D96A]' : 'text-[#A8E6BF]/80'}>
													{s.id}
												</span>
												<span className={i === 0 ? 'text-[#31D96A] bloom-soft' : 'text-[#A8E6BF]/80'}>
													${s.value.toLocaleString('en-US')}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						{/* --- The four real steps, as the loop's progress rail --- */}
						<ol className="grid grid-cols-1 border-t border-[#31D96A]/30 sm:grid-cols-2 lg:grid-cols-4">
							{DEMO_STEPS.map((s, i) => {
								const active = act === i;
								const done = act > i;
								return (
									<li
										key={s.code}
										aria-current={active ? 'step' : undefined}
										className={`relative border-b border-[#31D96A]/15 p-4 transition-colors duration-500 last:border-b-0 sm:border-r sm:last:border-r-0 lg:border-b-0 ${
											active ? 'bg-[#31D96A]/[0.12]' : ''
										}`}
									>
										<span
											aria-hidden="true"
											className={`absolute left-0 top-0 h-0.5 bg-[#31D96A] transition-all duration-700 ${
												active || done ? 'w-full' : 'w-0'
											}`}
										/>
										<div className="flex items-baseline gap-2">
											<span
												className={`font-board text-[16px] tracking-cell transition-colors duration-500 ${
													active ? 'text-[#31D96A]' : done ? 'text-[#4FAE79]' : 'text-[#1C5C38]'
												}`}
											>
												{s.code}
											</span>
											<h3
												className={`font-term text-[11px] font-bold uppercase tracking-label transition-colors duration-500 ${
													active || done ? 'text-[#A8E6BF]' : 'text-[#1C5C38]'
												}`}
											>
												{s.title}
											</h3>
										</div>
										<p
											className={`mt-1.5 font-term text-[11.5px] leading-relaxed transition-colors duration-500 ${
												active || done ? 'text-[#A8E6BF]/70' : 'text-[#1C5C38]'
											}`}
										>
											{s.description}
										</p>
										<span
											className={`mt-2 block font-term text-[9px] uppercase tracking-label transition-opacity duration-500 ${
												active || done ? 'text-[#22D3EE] opacity-100' : 'opacity-0'
											}`}
										>
											{s.status}
										</span>
									</li>
								);
							})}
						</ol>
					</div>

					<p className="pt-3 pb-2">
						<Label>
							Instruments, participants, fills and standings above are authored for this
							demonstration. The market behaves exactly this way in a live competition.
						</Label>
					</p>
				</div>
			</div>
		</section>
	);
};

export default MechanismDemo;
