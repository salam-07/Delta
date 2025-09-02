import PriceChart from '../common/PriceChart';

const Trade = () => {
    const Id = "68b71acd798af1f161bba9eb";
    return (
        <div>
            <div>Trade</div>
            <PriceChart stockId={Id} />
        </div>
    );
};

export default Trade;