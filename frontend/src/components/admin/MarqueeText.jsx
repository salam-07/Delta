import { useMarketStore } from '../../store/useMarketStore';

const MarqueeText = () => {
    const { marketOpen } = useMarketStore();

    const marketText = marketOpen ? "MARKET OPEN" : "MARKET CLOSED";
    const bgColor = marketOpen ? "bg-primary/30" : "bg-red-500/30";

    // Create continuous text with separators
    const separatedText = `${marketText} • `;
    const continuousText = separatedText.repeat(100); // Repeat many times for seamless scrolling

    return (
        <div className={`relative top-0 left-0 right-0 z-20 h-8 ${bgColor} overflow-hidden`}>
            <div className="relative h-full">
                {/* First scrolling text */}
                <div
                    className="absolute top-0 whitespace-nowrap text-white font-bold text-sm flex items-center h-full"
                    style={{
                        animation: 'marquee 350s linear infinite',
                        left: '0%'
                    }}
                >
                    {continuousText}
                </div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% {
                        transform: translateX(0%);
                    }
                    100% {
                        transform: translateX(-100%);
                    }
                }
            `}</style>
        </div>
    );
};

export default MarqueeText;