import React from 'react';

/**
 * A small caps label — the terminal's only voice for naming a field.
 * `cyan` is the default field name; `phosphor` promotes a label to the same
 * green as the data it sits beside, for headers that carry status.
 */
export const Label = ({ children, tone = 'cyan', className = '' }) => (
	<span
		className={`font-term text-[10px] uppercase tracking-label ${
			tone === 'phosphor' ? 'text-[#4FAE79]' : 'text-[#1FA8C4]'
		} ${className}`}
	>
		{children}
	</span>
);

/** A function-key cap, reused wherever the page offers an action. */
export const KeyCap = ({ children }) => (
	<span
		aria-hidden="true"
		className="font-board text-[13px] tracking-cell text-[#1C5C38] group-hover:text-[#31D96A] transition-colors"
	>
		{children}
	</span>
);

const SPAN = {
	left: 'lg:col-start-1',
	right: 'lg:col-start-4',
	center: 'lg:col-start-2',
};

// Tailwind can't see interpolated class names, so the useful spans are explicit.
const COLS = {
	7: 'lg:col-span-7',
	8: 'lg:col-span-8',
	9: 'lg:col-span-9',
	10: 'lg:col-span-10',
	11: 'lg:col-span-11',
	12: 'lg:col-span-12',
};

/**
 * A panel docked over the Big Board.
 *
 * Deliberately narrower than the viewport and offset to one side, so the quote
 * wall stays visible beside it — that asymmetry is the composition. Opaque
 * where text sits, because a moving board behind body copy is unreadable.
 */
const Dock = ({
	id,
	tab,
	meta,
	align = 'left',
	cols = 9,
	children,
	className = '',
	bodyClassName = 'p-5 sm:p-8 lg:p-10',
}) => (
	<section id={id} className={`relative z-10 scroll-mt-14 px-3 sm:px-6 ${className}`}>
		<div className="mx-auto grid max-w-[1560px] grid-cols-1 lg:grid-cols-12">
			<div className={`dock dock-ticks ${SPAN[align]} ${COLS[cols] || COLS[9]}`}>
				<div className="flex items-stretch justify-between border-b border-[#31D96A]/38">
					<span className="dock-tab px-3 py-1.5 font-term text-[10px] font-bold uppercase tracking-label">
						{tab}
					</span>
					{meta ? (
						<span className="flex items-center px-3 py-1.5 text-right">
							<Label>{meta}</Label>
						</span>
					) : null}
				</div>
				<div className={bodyClassName}>{children}</div>
			</div>
		</div>
	</section>
);

export default Dock;
