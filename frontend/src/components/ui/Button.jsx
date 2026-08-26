import { Loader2 } from "lucide-react";

/**
 * Button — every control in the application surface.
 *
 * Square, ruled, uppercase: the F-key rail idiom the rest of Delta is drawn
 * in. `up` and `down` are reserved for price direction (buy / sell), matching
 * the token contract in tailwind.config.js.
 */

const VARIANTS = {
    // The one action a screen is for.
    primary:
        "bg-phosphor text-ink border border-phosphor hover:bg-phosphor-bright hover:border-phosphor-bright active:bg-phosphor-mid",
    // Everything else: present, ruled, not competing.
    default:
        "bg-ink-raised text-phosphor-bright border border-phosphor/30 hover:border-phosphor/60 hover:bg-phosphor/10 active:bg-phosphor/15",
    // No chrome until touched. For dense row actions.
    ghost: "bg-transparent text-phosphor-mid border border-transparent hover:text-phosphor-bright hover:border-phosphor/30 hover:bg-phosphor/5",
    buy: "bg-signal-up/15 text-signal-up border border-signal-up/45 hover:bg-signal-up/25 hover:border-signal-up active:bg-signal-up/30",
    sell: "bg-signal-down/15 text-signal-down border border-signal-down/45 hover:bg-signal-down/25 hover:border-signal-down active:bg-signal-down/30",
    danger: "bg-transparent text-signal-down border border-signal-down/40 hover:bg-signal-down/15 hover:border-signal-down",
};

const SIZES = {
    sm: "h-7 px-2.5 text-[10px] gap-1.5",
    md: "h-9 px-4 text-[11px] gap-2",
    lg: "h-11 px-6 text-xs gap-2",
};

const ICON_SIZES = { sm: "size-7", md: "size-9", lg: "size-11" };

export const Button = ({
    as: Component = "button",
    variant = "default",
    size = "md",
    loading = false,
    icon = false,
    disabled = false,
    className = "",
    type = "button",
    children,
    ...rest
}) => {
    // `type`, `disabled` and `aria-busy` are button attributes. When this
    // renders a link — an empty-state CTA pointing at another route — they are
    // either meaningless or wrong on an anchor, so they are not passed through.
    const isButton = Component === "button";

    return (
        <Component
            {...(isButton
                ? { type, disabled: disabled || loading, "aria-busy": loading || undefined }
                : { "aria-disabled": disabled || undefined })}
            className={`inline-flex shrink-0 items-center justify-center font-term uppercase tracking-label transition-colors duration-100
            disabled:cursor-not-allowed disabled:border-phosphor-dim disabled:bg-transparent disabled:text-phosphor-mid/50 disabled:hover:bg-transparent
            ${VARIANTS[variant] ?? VARIANTS.default}
            ${icon ? `${ICON_SIZES[size] ?? ICON_SIZES.md} px-0` : (SIZES[size] ?? SIZES.md)}
            ${className}`}
            {...rest}
        >
            {loading ? <Loader2 className="size-3.5 shrink-0 animate-spin" aria-hidden="true" /> : null}
            {children}
        </Component>
    );
};

export default Button;
