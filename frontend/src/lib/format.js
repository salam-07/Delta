// Formatting for the application surface. Every figure in Delta is data —
// a price, a quantity, a balance, a timestamp — so it is formatted in one
// place and rendered with tabular numerals (see `.delta-app` in index.css).

const CURRENCY = {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
};

/** `$1,234.50` — prices, balances, totals. */
export const money = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("en-US", CURRENCY);
};

/** `$1,234.50` carrying an explicit sign. For gains and losses. */
export const signedMoney = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return `${n >= 0 ? "+" : "-"}${Math.abs(n).toLocaleString("en-US", CURRENCY)}`;
};

/** `1,234` — share counts, trade counts, participant counts. */
export const count = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return n.toLocaleString("en-US");
};

/** `+4.20%` / `-4.20%`. */
export const signedPercent = (value, digits = 2) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    return `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(digits)}%`;
};

/** `$1.2M` — for headline figures that must not wrap. Keeps the unit. */
export const compactMoney = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}K`;
    return `${sign}$${abs.toFixed(2)}`;
};

/** `1.2M` — same treatment for unitless counts. */
export const compactCount = (value) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return "—";
    const abs = Math.abs(n);
    const sign = n < 0 ? "-" : "";
    if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(1)}M`;
    if (abs >= 1_000) return `${sign}${(abs / 1_000).toFixed(1)}K`;
    return `${sign}${abs.toLocaleString("en-US")}`;
};

/** `26 Aug 2026, 14:30` — the product's one timestamp format. */
export const dateTime = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });
};

/** `14:30:52` — for the live clock and same-session event logs. */
export const clockTime = (value) => {
    const d = value ? new Date(value) : new Date();
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleTimeString("en-GB", { hour12: false });
};

/** First initial for an avatar cell, safe against empty and missing names. */
export const initial = (name) => {
    const trimmed = String(name ?? "").trim();
    return trimmed ? trimmed[0].toUpperCase() : "—";
};

/**
 * Price change against a stock's opening price.
 * Returns nulls when there is no basis to compare against, so callers can
 * render an explicit "no opening price" state instead of a fake 0.00%.
 */
export const priceChange = (stock) => {
    const price = Number(stock?.price);
    const open = Number(stock?.openingPrice);
    if (!Number.isFinite(price) || !Number.isFinite(open) || open <= 0) {
        return { absolute: null, percent: null, direction: "flat" };
    }
    const absolute = price - open;
    return {
        absolute,
        percent: (absolute / open) * 100,
        direction: absolute > 0 ? "up" : absolute < 0 ? "down" : "flat",
    };
};
