import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useMarketStore } from '../store/useMarketStore';

const PriceChart = ({ stockId, height = 400, showGrid = true, className = "" }) => {
    const [chartData, setChartData] = useState([]);
    const [error, setError] = useState(null);
    const { fetchStockHistory, history, isHistoryLoading } = useMarketStore();

    useEffect(() => {
        if (!stockId) return;
        setError(null);
        console.log('PriceChart: Fetching history for stockId:', stockId);
        fetchStockHistory(stockId);
    }, [stockId, fetchStockHistory]);

    // Transform history data when it changes
    useEffect(() => {
        console.log('PriceChart: History data changed:', history);
        if (history && history.length > 0) {
            console.log('PriceChart: Formatting history data, length:', history.length);
            const formattedData = history.map((item, index) => ({
                time: new Date(item.createdAt).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: false
                }),
                price: parseFloat(item.price),
                fullDate: new Date(item.createdAt).toLocaleString(),
                index: index
            }));
            console.log('PriceChart: Formatted data:', formattedData);
            setChartData(formattedData);
        } else {
            console.log('PriceChart: No history data or empty array');
            setChartData([]);
        }
    }, [history]);

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="rounded-lg p-3 shadow-lg backdrop-blur-md">
                    <p className="text-gray-300 text-sm">{data.fullDate}</p>
                    <p className="text-green-400 font-semibold">
                        Price: ${payload[0].value.toFixed(2)}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Determine line color based on price trend
    const getLineColor = () => {
        if (chartData.length < 2) return '#10b981'; // Default green
        const firstPrice = chartData[0]?.price;
        const lastPrice = chartData[chartData.length - 1]?.price;
        return lastPrice >= firstPrice ? '#10b981' : '#ef4444'; // Green if up, red if down
    };

    if (isHistoryLoading) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <div className="flex items-center space-x-2 text-gray-400">
                    <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    <span>Loading price history...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <div className="text-center text-gray-400">
                    <p className="text-red-400 mb-2">⚠️ {error}</p>
                    <button
                        onClick={() => stockId && fetchStockHistory(stockId)}
                        className="text-green-400 hover:text-green-300 underline text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    if (chartData.length === 0) {
        return (
            <div className={`flex items-center justify-center ${className}`} style={{ height }}>
                <div className="text-center text-gray-500">
                    <p>No price history available</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`w-full ${className}`} style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 20,
                    }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#374151"
                            opacity={0.1}
                        />
                    )}
                    <XAxis
                        dataKey="time"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '', fontSize: 12 }}
                        interval="preserveStartEnd"
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                        domain={['dataMin - 1', 'dataMax + 1']}
                        tickFormatter={(value) => `$${value.toFixed(2)}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="linear"
                        dataKey="price"
                        stroke={getLineColor()}
                        strokeWidth={3}
                        dot={{
                            fill: getLineColor(),
                            strokeWidth: 2,
                            stroke: '#000000',
                            r: 4
                        }}
                        activeDot={{
                            r: 6,
                            fill: getLineColor(),
                            stroke: '#000000',
                            strokeWidth: 2
                        }}
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;