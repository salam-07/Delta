import PriceChart from '../common/PriceChart';

const Trade = () => {
    const Id = "68b72bd6798af1f161bbac3c";
    return (
        <div>
            <div>Historical Data for NVDA</div>
            <PriceChart stockId={Id} />
        </div>
    );
};

export default Trade;