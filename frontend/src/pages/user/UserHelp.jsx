import { ChevronRight, HelpCircle } from "lucide-react";
import UserLayout from "../../layouts/UserLayout";
import { Panel, PanelHeader } from "../../components/ui/Panel";

/**
 * Help, written against what the product actually does.
 *
 * Native `<details>` rather than the daisyUI radio-input accordion this page
 * used: radio inputs cannot all be closed once one is open, and a disclosure
 * list is exactly what `<details>` is for — keyboard-operable, findable by the
 * browser's own in-page search, and correct with no JavaScript.
 */
const FAQ = [
    {
        q: "How do I place an order?",
        a: (
            <>
                <p>Two routes lead to the same fill:</p>
                <ol className="ml-4 list-outside list-decimal space-y-1.5">
                    <li>
                        <strong className="text-phosphor">Market</strong> — the board lists every stock with its live
                        price. Set a share count on the row and press Buy or Sell.
                    </li>
                    <li>
                        <strong className="text-phosphor">Trade</strong> — pick one stock and work the full ticket:
                        order value, resulting cash, and realised profit or loss are all stated before you commit.
                    </li>
                </ol>
                <p>
                    Orders fill immediately at the price shown. There is no confirmation step, so read the figures
                    first.
                </p>
            </>
        ),
    },
    {
        q: "Why is the Sell button disabled?",
        a: (
            <p>
                You can only sell shares you hold. Sell stays disabled on a stock until you own at least one share of
                it, and the share field will not accept more than your holding. Your holding for the selected stock is
                shown on the Trade ticket.
            </p>
        ),
    },
    {
        q: "How much cash do I start with?",
        a: (
            <p>
                Every participant is credited <strong className="text-phosphor">$3,000</strong> at signup. That figure
                is also the basis for your return: the percentage on your Portfolio compares your current net worth —
                cash plus holdings at live prices — against it.
            </p>
        ),
    },
    {
        q: "Why did a price suddenly move?",
        a: (
            <p>
                Prices move when an administrator publishes a development. A development can carry price changes for
                one or more stocks, and they apply the moment it goes out on the wire. Read Developments to see what
                moved and why; the price record on the Trade page shows the move itself.
            </p>
        ),
    },
    {
        q: "What does Open or Closed mean in the top bar?",
        a: (
            <p>
                It is the market's trading state, set by an administrator. Orders are only accepted while the market is
                open. The lamp beside it stays lit for as long as trading is live, so you can check without leaving the
                page you are on.
            </p>
        ),
    },
    {
        q: "How is profit and loss worked out?",
        a: (
            <>
                <p>Two different figures, both on your Portfolio:</p>
                <ul className="ml-4 list-outside list-disc space-y-1.5">
                    <li>
                        <strong className="text-phosphor">Per position</strong> — the live price against the price you
                        paid, multiplied by the shares you hold. Unrealised until you sell.
                    </li>
                    <li>
                        <strong className="text-phosphor">Return</strong> — your whole account, cash included, against
                        the $3,000 you started with.
                    </li>
                </ul>
                <p>History lists every order you have filled, newest first, with the price each one filled at.</p>
            </>
        ),
    },
];

const UserHelp = () => (
    <UserLayout title="Help">
        <div className="mx-auto max-w-3xl space-y-6">
            <Panel ticks>
                <PanelHeader label="Common questions" />
                <div>
                    {FAQ.map(({ q, a }) => (
                        <details key={q} className="group border-b border-phosphor/15 last:border-b-0">
                            <summary
                                className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5
                                    font-term text-sm text-phosphor-bright transition-colors hover:bg-phosphor/5
                                    focus-visible:bg-phosphor/5 [&::-webkit-details-marker]:hidden"
                            >
                                {q}
                                <ChevronRight
                                    aria-hidden="true"
                                    className="size-4 shrink-0 text-phosphor-mid transition-transform group-open:rotate-90"
                                />
                            </summary>
                            <div className="space-y-3 border-t border-phosphor/10 px-4 py-4 font-term text-xs leading-relaxed text-phosphor-mid">
                                {a}
                            </div>
                        </details>
                    ))}
                </div>
            </Panel>

            <Panel>
                <PanelHeader label="Still stuck" />
                <div className="flex flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:gap-5">
                    <HelpCircle className="size-5 shrink-0 text-phosphor-dim" strokeWidth={1.5} aria-hidden="true" />
                    <p className="font-term text-xs leading-relaxed text-phosphor-mid">
                        If the answer is not above, contact support at{" "}
                        <a
                            href="tel:03337298886"
                            className="text-phosphor underline decoration-phosphor/40 underline-offset-4 transition-colors hover:decoration-phosphor"
                        >
                            0333-729-8886
                        </a>
                        .
                    </p>
                </div>
            </Panel>
        </div>
    </UserLayout>
);

export default UserHelp;
