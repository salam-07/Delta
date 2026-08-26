import { CircleSlash } from "lucide-react";

/**
 * The states a panel is in when it has nothing to show. Each one names what is
 * missing and, where there is one, the way out.
 */

/** Draft / Published, Open / Closed, Online / Offline. Square, ruled, legible. */
const PILL_TONES = {
    live: "border-signal-up/45 bg-signal-up/10 text-signal-up",
    draft: "border-phosphor/30 bg-phosphor/5 text-phosphor-mid",
    accent: "border-phosphor/45 bg-phosphor/10 text-phosphor",
    halted: "border-signal-down/45 bg-signal-down/10 text-signal-down",
    info: "border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan",
};

export const StatusPill = ({ tone = "draft", children, className = "" }) => (
    <span
        className={`inline-flex items-center gap-1.5 border px-2 py-0.5 font-term text-[10px] uppercase tracking-label
            ${PILL_TONES[tone] ?? PILL_TONES.draft} ${className}`}
    >
        {children}
    </span>
);

/** A two-state panel indicator: lit and pulsing, or dark and still. */
export const Lamp = ({ on, className = "" }) => (
    <span
        aria-hidden="true"
        className={`size-2 shrink-0 ${on ? "bg-signal-up lamp-on" : "bg-signal-down"} ${className}`}
    />
);

export const EmptyState = ({ label, description, icon: Icon = CircleSlash, action, className = "" }) => (
    <div className={`hatch flex flex-col items-center justify-center px-6 py-14 text-center ${className}`}>
        <Icon className="size-6 text-phosphor-dim" aria-hidden="true" strokeWidth={1.5} />
        <p className="mt-4 font-term text-[11px] uppercase tracking-label text-phosphor-mid">{label}</p>
        {description ? (
            <p className="mt-2 max-w-sm font-term text-xs leading-relaxed text-phosphor-mid">{description}</p>
        ) : null}
        {action ? <div className="mt-5">{action}</div> : null}
    </div>
);

/**
 * Loading placeholders shaped like the rows they replace, so the panel does not
 * change height when data arrives.
 */
export const SkeletonRows = ({ rows = 5, className = "" }) => (
    <div className={className} aria-hidden="true">
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-phosphor/10 px-4 py-3.5 last:border-b-0">
                <div className="h-3 w-16 animate-pulse bg-phosphor-dim/60" />
                <div className="h-3 flex-1 animate-pulse bg-phosphor-dim/40" />
                <div className="h-3 w-20 animate-pulse bg-phosphor-dim/60" />
            </div>
        ))}
    </div>
);

/** A single pulsing bar, for a figure that has not arrived yet. */
export const SkeletonValue = ({ className = "w-24" }) => (
    <span className={`inline-block h-5 animate-pulse bg-phosphor-dim/60 align-middle ${className}`} aria-hidden="true" />
);

/** The product's one busy indicator. */
export const LoadingPanel = ({ label = "Loading", className = "" }) => (
    <div className={`flex items-center justify-center gap-3 px-6 py-14 ${className}`} role="status">
        <span
            className="size-4 shrink-0 animate-spin border border-phosphor/25 border-t-phosphor"
            aria-hidden="true"
        />
        <span className="font-term text-[11px] uppercase tracking-label text-phosphor-mid">{label}</span>
    </div>
);

export const ErrorPanel = ({ label = "Could not load", description, action, className = "" }) => (
    <div className={`flex flex-col items-center justify-center px-6 py-14 text-center ${className}`} role="alert">
        <p className="font-term text-[11px] uppercase tracking-label text-signal-down">{label}</p>
        {description ? (
            <p className="mt-2 max-w-sm font-term text-xs leading-relaxed text-phosphor-mid">{description}</p>
        ) : null}
        {action ? <div className="mt-5">{action}</div> : null}
    </div>
);
