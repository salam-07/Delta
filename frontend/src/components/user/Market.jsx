
import StockTable from '../common/StockTable';

const Market = () => {
    return (
        <div>
            <div>Market</div>
            <StockTable
                showActions={false}
                showDeleteColumn={false}
                showRefreshButton={true}
                title="Stocks"
            />
        </div>
    );
};

export default Market;