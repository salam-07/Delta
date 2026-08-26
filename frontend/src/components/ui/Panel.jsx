/**
 * Panel — the one container in the Delta application surface.
 *
 * A bounded instrument reading: hairline rule, flat ink ground, optional
 * corner registration ticks. Panels do not nest; a region inside a panel uses
 * `panel-inset` or a rule, never a second panel.
 */
export const Panel = ({ as: Tag = "section", ticks = false, className = "", children, ...rest }) => (
    <Tag className={`panel ${ticks ? "ticks" : ""} ${className}`} {...rest}>
        {children}
    </Tag>
);

/**
 * The panel's title strip. `label` is the machine-readable name of what the
 * panel holds; `children` is the strip's right-hand control slot.
 */
export const PanelHeader = ({ label, as: Tag = "h2", className = "", children }) => (
    <div
        className={`flex min-h-[2.75rem] items-center justify-between gap-3 border-b border-phosphor/20 px-4 ${className}`}
    >
        <Tag className="font-term text-[11px] uppercase tracking-label text-phosphor-mid">{label}</Tag>
        {children ? <div className="flex shrink-0 items-center gap-2">{children}</div> : null}
    </div>
);

/**
 * A column-header rule for tabular data. Sits directly above the rows so the
 * columns it names are unambiguous.
 */
export const PanelColumns = ({ className = "", children }) => (
    <div
        className={`border-b border-phosphor/20 bg-ink-raised px-4 py-2 font-term text-[10px] uppercase tracking-label text-phosphor-mid ${className}`}
    >
        {children}
    </div>
);

export default Panel;
