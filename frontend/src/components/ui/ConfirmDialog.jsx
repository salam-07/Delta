import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";

/**
 * ConfirmDialog — replaces `window.confirm`, which rendered an OS chrome box
 * in a system font in the middle of a phosphor terminal, and named neither the
 * record being destroyed nor the consequence.
 *
 * A modal is right here: deletion is irreversible and needs protected focus.
 */
export const ConfirmDialog = ({
    open,
    title,
    description,
    confirmLabel = "Delete",
    cancelLabel = "Cancel",
    variant = "danger",
    loading = false,
    onConfirm,
    onCancel,
}) => {
    const confirmRef = useRef(null);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;

        const previouslyFocused = document.activeElement;
        confirmRef.current?.focus();

        const onKeyDown = (e) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onCancel?.();
                return;
            }
            // Keep tabbing inside the dialog while it owns the screen.
            if (e.key !== "Tab") return;
            const focusable = panelRef.current?.querySelectorAll("button:not([disabled])");
            if (!focusable?.length) return;
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", onKeyDown);
        const { overflow } = document.body.style;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = overflow;
            if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
        };
    }, [open, onCancel]);

    if (!open) return null;

    return createPortal(
        <div className="delta-app fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-ink/85" onClick={onCancel} aria-hidden="true" />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-title"
                aria-describedby={description ? "confirm-description" : undefined}
                className="panel ticks relative w-full max-w-md"
            >
                <div className="flex min-h-[2.75rem] items-center border-b border-phosphor/20 px-4">
                    <p className="font-term text-[11px] uppercase tracking-label text-phosphor-mid">Confirm</p>
                </div>
                <div className="px-5 py-5">
                    <h2 id="confirm-title" className="font-term text-base text-phosphor-bright">
                        {title}
                    </h2>
                    {description ? (
                        <p id="confirm-description" className="mt-2 font-term text-xs leading-relaxed text-phosphor-mid">
                            {description}
                        </p>
                    ) : null}
                </div>
                <div className="flex justify-end gap-2 border-t border-phosphor/20 px-5 py-3.5">
                    <Button variant="ghost" onClick={onCancel} disabled={loading}>
                        {cancelLabel}
                    </Button>
                    <Button ref={confirmRef} variant={variant} onClick={onConfirm} loading={loading}>
                        {confirmLabel}
                    </Button>
                </div>
            </div>
        </div>,
        document.body,
    );
};

export default ConfirmDialog;
