import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * Form controls for the application surface. Every field carries a real
 * `<label>` bound by id — the product had bare inputs and unlabelled selects
 * before, which left screen readers with nothing to announce.
 */

const CONTROL =
    "h-10 w-full bg-ink border border-phosphor/25 px-3 font-term text-sm text-phosphor-bright " +
    "placeholder:text-phosphor-mid/70 transition-colors duration-100 " +
    "hover:border-phosphor/40 focus:border-phosphor " +
    "disabled:cursor-not-allowed disabled:border-phosphor-dim disabled:text-phosphor-mid/50";

export const FieldLabel = ({ htmlFor, children, className = "" }) => (
    <label
        htmlFor={htmlFor}
        className={`block font-term text-[10px] uppercase tracking-label text-phosphor-mid ${className}`}
    >
        {children}
    </label>
);

export const TextField = ({
    label,
    hint,
    prefix,
    suffix,
    id: providedId,
    className = "",
    containerClassName = "",
    ...rest
}) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hintId = hint ? `${id}-hint` : undefined;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
            <div className="relative">
                {prefix ? (
                    <span
                        className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-phosphor-mid"
                        aria-hidden="true"
                    >
                        {prefix}
                    </span>
                ) : null}
                <input
                    id={id}
                    aria-describedby={hintId}
                    className={`${CONTROL} ${prefix ? "pl-10" : ""} ${suffix ? "pr-10" : ""} ${className}`}
                    {...rest}
                />
                {suffix ? (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 text-phosphor-mid">{suffix}</span>
                ) : null}
            </div>
            {hint ? (
                <p id={hintId} className="font-term text-[10px] text-phosphor-mid">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

export const TextAreaField = ({ label, hint, id: providedId, rows = 4, className = "", containerClassName = "", ...rest }) => {
    const autoId = useId();
    const id = providedId ?? autoId;
    const hintId = hint ? `${id}-hint` : undefined;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
            <textarea
                id={id}
                rows={rows}
                aria-describedby={hintId}
                className={`${CONTROL} h-auto resize-y py-2.5 leading-relaxed ${className}`}
                {...rest}
            />
            {hint ? (
                <p id={hintId} className="font-term text-[10px] text-phosphor-mid">
                    {hint}
                </p>
            ) : null}
        </div>
    );
};

export const SelectField = ({ label, id: providedId, className = "", containerClassName = "", children, ...rest }) => {
    const autoId = useId();
    const id = providedId ?? autoId;

    return (
        <div className={`space-y-1.5 ${containerClassName}`}>
            {label ? <FieldLabel htmlFor={id}>{label}</FieldLabel> : null}
            <select id={id} className={`${CONTROL} cursor-pointer pr-8 ${className}`} {...rest}>
                {children}
            </select>
        </div>
    );
};

/**
 * A password field with a reveal toggle. The toggle is a real button with a
 * label and a pressed state — it was an unlabelled `<button>` holding only an
 * icon on both auth pages, which a screen reader announced as "button".
 */
export const PasswordField = ({ ...rest }) => {
    const [visible, setVisible] = useState(false);
    const Icon = visible ? EyeOff : Eye;

    return (
        <TextField
            type={visible ? "text" : "password"}
            suffix={
                <button
                    type="button"
                    onClick={() => setVisible((on) => !on)}
                    aria-pressed={visible}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="p-1.5 transition-colors hover:text-phosphor-bright"
                >
                    <Icon className="size-4" aria-hidden="true" />
                </button>
            }
            {...rest}
        />
    );
};

/**
 * A bare numeric cell for inline editing inside a data row, where a stacked
 * label would break the column. Always pass `aria-label`.
 */
export const InlineNumberField = ({ className = "", ...rest }) => (
    <input
        type="number"
        className={`h-7 bg-ink border border-phosphor/25 px-2 text-center font-term text-xs text-phosphor-bright
            transition-colors duration-100 hover:border-phosphor/40 focus:border-phosphor
            disabled:cursor-not-allowed disabled:border-phosphor-dim disabled:text-phosphor-mid/50 ${className}`}
        {...rest}
    />
);
