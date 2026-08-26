import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { signedMoney, signedPercent } from "../../lib/format";

/**
 * Readouts — how the application surface states a figure.
 *
 * Deliberately not a stat card. A terminal states totals as a ruled row of
 * label-over-value readouts sharing one panel, so figures can be compared by
 * scanning across; four floating cards each shouting a 6rem number cannot be.
 * Values stay inside the type scale so long numbers never overflow.
 */

const VALUE_SIZES = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-2xl",
};

const TONES = {
    default: "text-phosphor-bright",
    accent: "text-phosphor",
    up: "text-signal-up",
    down: "text-signal-down",
    muted: "text-phosphor-mid",
};

export const Readout = ({ label, value, note, tone = "default", size = "md", className = "" }) => (
    <div className={`min-w-0 bg-ink-panel px-4 py-3 ${className}`}>
        <div className="font-term text-[10px] uppercase tracking-label text-phosphor-mid">{label}</div>
        <div className={`mt-1.5 truncate font-term ${VALUE_SIZES[size] ?? VALUE_SIZES.md} ${TONES[tone] ?? TONES.default}`}>
            {value}
        </div>
        {note ? <div className="mt-1 truncate font-term text-[11px] text-phosphor-mid">{note}</div> : null}
    </div>
);

const STRIP_COLS = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-2 lg:grid-cols-5",
};

/**
 * A ruled row of readouts: one panel, N figures, a hairline between each.
 * The rule is the container's own background showing through a 1px gap, so
 * the grid stays correct at every column count and every wrap.
 */
export const ReadoutStrip = ({ cols = 4, className = "", children }) => (
    <div className={`grid grid-cols-1 gap-px bg-phosphor/15 ${STRIP_COLS[cols] ?? STRIP_COLS[4]} ${className}`}>
        {children}
    </div>
);

/**
 * A signed change. Direction is carried by colour *and* by an arrow, so it
 * survives greyscale and colour-blind viewing. `up`/`down` are reserved for
 * price direction only.
 */
export const Change = ({ absolute, percent, size = "sm", showAbsolute = true, className = "" }) => {
    const basis = Number.isFinite(absolute) ? absolute : percent;

    if (!Number.isFinite(basis)) {
        return (
            <span className={`inline-flex items-center gap-1 font-term text-phosphor-mid ${className}`}>
                <Minus className="size-3 shrink-0" aria-hidden="true" />
                <span className="sr-only">No change data</span>
                <span aria-hidden="true">—</span>
            </span>
        );
    }

    const rising = basis > 0;
    const flat = basis === 0;
    const Icon = flat ? Minus : rising ? ArrowUp : ArrowDown;
    const tone = flat ? "text-phosphor-mid" : rising ? "text-signal-up" : "text-signal-down";

    return (
        <span className={`inline-flex items-center gap-1.5 font-term ${tone} ${className}`}>
            <Icon className={`${size === "lg" ? "size-4" : "size-3"} shrink-0`} aria-hidden="true" />
            {showAbsolute && Number.isFinite(absolute) ? <span>{signedMoney(absolute)}</span> : null}
            {Number.isFinite(percent) ? (
                <span className={showAbsolute && Number.isFinite(absolute) ? "opacity-75" : ""}>
                    {signedPercent(percent)}
                </span>
            ) : null}
        </span>
    );
};
