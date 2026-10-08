/**
 * Synthetic market material for the landing page's Big Board.
 *
 * None of this is real market data and none of it claims to be: Delta's markets
 * are authored per competition by an administrator, so a board of invented
 * instruments is what the product actually produces. Every surface that shows
 * these rows labels them as demonstration data.
 */

export const BOARD_TICKERS = [
	{ sym: 'NOVA', name: 'Nova Dynamics', price: 142.5, chg: 2.35 },
	{ sym: 'HELX', name: 'Helix Biotic', price: 88.2, chg: -1.14 },
	{ sym: 'KTON', name: 'Keystone Rail', price: 61.75, chg: -3.42 },
	{ sym: 'VRDA', name: 'Verda Energy', price: 205.4, chg: 6.18 },
	{ sym: 'ATLS', name: 'Atlas Freight', price: 47.1, chg: -0.88 },
	{ sym: 'MRDN', name: 'Meridian Bank', price: 318.05, chg: 1.72 },
	{ sym: 'CBLT', name: 'Cobalt Mining', price: 74.6, chg: 4.05 },
	{ sym: 'PLSR', name: 'Pulsar Media', price: 29.35, chg: -2.16 },
	{ sym: 'TIDE', name: 'Tidewater Shipping', price: 156.9, chg: 0.94 },
	{ sym: 'ZNTH', name: 'Zenith Air', price: 93.45, chg: -4.61 },
	{ sym: 'GRVE', name: 'Grove Retail', price: 51.2, chg: 1.28 },
	{ sym: 'LUMN', name: 'Lumen Optics', price: 187.75, chg: 3.44 },
	{ sym: 'QUAR', name: 'Quarry Cement', price: 38.9, chg: -1.05 },
	{ sym: 'ARBR', name: 'Arbor Foods', price: 112.3, chg: 0.42 },
	{ sym: 'HRTH', name: 'Hearth Utilities', price: 66.15, chg: -0.31 },
	{ sym: 'SABL', name: 'Sable Chemical', price: 84.7, chg: 2.9 },
	{ sym: 'ONYX', name: 'Onyx Semiconductor', price: 241.6, chg: 5.27 },
	{ sym: 'FRST', name: 'Forster Timber', price: 43.05, chg: -2.74 },
	{ sym: 'VANE', name: 'Vane Wind', price: 128.85, chg: 3.11 },
	{ sym: 'CRUX', name: 'Crux Logistics', price: 71.4, chg: -1.66 },
	{ sym: 'BRIL', name: 'Brill Pharma', price: 199.2, chg: 0.78 },
	{ sym: 'STRA', name: 'Strand Textiles', price: 26.55, chg: -3.08 },
];

/** Nudge a price the way an authored market drifts between admin updates. */
export function tickRow(row) {
	const drift = (Math.random() - 0.48) * (row.price * 0.006);
	const price = Math.max(1.02, row.price + drift);
	return {
		...row,
		price,
		chg: row.chg + drift * 0.42,
		flip: (row.flip || 0) + 1,
	};
}

export const money = (n) =>
	n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const signed = (n) => `${n >= 0 ? '+' : '−'}${Math.abs(n).toFixed(2)}`;

export const pct = (chg, price) =>
	`${chg >= 0 ? '+' : '−'}${Math.abs((chg / (price - chg || price)) * 100).toFixed(2)}%`;

/* ---------------------------------------------------------------------------
   The scripted mechanism demonstration. Four acts, matching Delta's four real
   onboarding steps. Deterministic — no randomness — so the numbers reconcile
   every time it runs.
   --------------------------------------------------------------------------- */

export const DEMO_STEPS = [
	{
		code: '01',
		title: 'Contact us',
		description: 'Tell us what you need and we set the competition up with you.',
		status: 'MARKET CREATED',
	},
	{
		code: '02',
		title: 'Add participants',
		description: 'We set up each participant with a starting cash balance.',
		status: 'PARTICIPANTS READY',
	},
	{
		code: '03',
		title: 'Start trading',
		description: 'Participants buy and sell, manage their portfolios and try out strategies.',
		status: 'NEWS PUBLISHED',
	},
	{
		code: '04',
		title: 'Track progress',
		description: 'Instructors follow the leaderboard and see how everyone did.',
		status: 'RESULTS FINAL',
	},
];

export const DEMO_TICKERS = [
	{ sym: 'KTON', sector: 'RAIL', open: 61.75, close: 56.55 },
	{ sym: 'ATLS', sector: 'FREIGHT', open: 47.1, close: 44.22 },
	{ sym: 'NOVA', sector: 'INDUSTRIAL', open: 142.5, close: 140.79 },
	{ sym: 'HELX', sector: 'BIOTIC', open: 88.2, close: 88.55 },
	{ sym: 'VRDA', sector: 'ENERGY', open: 205.4, close: 213.21 },
];

export const DEMO_DEVELOPMENT = {
	slug: 'DEV-0417',
	priority: 'HIGH',
	stamp: '11:04:22',
	headline: 'CENTRAL BANK LIFTS POLICY RATE 75BP',
	body: 'Freight and rail carriers face higher financing costs into the next quarter. Energy holds firm on contracted supply.',
	author: 'ADMINISTRATOR',
};

export const DEMO_FILLS = [
	{ id: 'P-0142', side: 'SELL', qty: 40, sym: 'KTON', at: 58.1, stamp: '11:04:31' },
	{ id: 'P-0088', side: 'BUY', qty: 120, sym: 'VRDA', at: 209.85, stamp: '11:04:36' },
	{ id: 'P-0311', side: 'SELL', qty: 75, sym: 'ATLS', at: 44.6, stamp: '11:04:44' },
];

export const DEMO_STANDINGS_OPEN = [
	{ id: 'P-0142', value: 104820 },
	{ id: 'P-0007', value: 101940 },
	{ id: 'P-0088', value: 99610 },
	{ id: 'P-0311', value: 98450 },
];

export const DEMO_STANDINGS_CLOSE = [
	{ id: 'P-0088', value: 108355 },
	{ id: 'P-0142', value: 106190 },
	{ id: 'P-0311', value: 99880 },
	{ id: 'P-0007', value: 97120 },
];

export const DEMO_INDEX = { open: 1842.66, close: 1798.2 };
