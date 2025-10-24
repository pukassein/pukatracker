import React from 'react';

interface PieChartProps {
    data: { name: string; value: number }[];
    colors: string[];
}

const PieChart: React.FC<PieChartProps> = ({ data, colors }) => {
    const total = data.reduce((acc, item) => acc + item.value, 0);
    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-full w-full">
                <p className="text-zinc-500">No expense data for the selected period.</p>
            </div>
        );
    }

    let cumulativePercent = 0;
    const slices = data.map((item, index) => {
        const percent = (item.value / total) * 100;
        const start = cumulativePercent;
        cumulativePercent += percent;
        const end = cumulativePercent;
        const color = colors[index % colors.length];

        return {
            ...item,
            percent,
            start,
            end,
            color,
        };
    });

    const getCoordinatesForPercent = (percent: number) => {
        const x = Math.cos(2 * Math.PI * (percent / 100));
        const y = Math.sin(2 * Math.PI * (percent / 100));
        return [x, y];
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-48 h-48 md:w-56 md:h-56">
                <svg viewBox="-1 -1 2 2" className="transform -rotate-90">
                    {slices.map(slice => {
                        const [startX, startY] = getCoordinatesForPercent(slice.start);
                        const [endX, endY] = getCoordinatesForPercent(slice.end);
                        const largeArcFlag = slice.percent > 50 ? 1 : 0;
                        const pathData = [
                            `M ${startX} ${startY}`,
                            `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                            'L 0 0',
                        ].join(' ');

                        return <path key={slice.name} d={pathData} fill={slice.color} />;
                    })}
                </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-zinc-800 w-24 h-24 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center text-center p-2">
                         <span className="text-xs text-zinc-400">Total Spent</span>
                         <span className="text-white text-lg md:text-xl font-bold">
                           {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}
                         </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PieChart;
