import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { Tooltip } from '@nivo/tooltip';


const BarChart = () => {
    const theme = useTheme();
    const [tooltip, setTooltip] = useState(null);

    const [filteredData, setFilteredData] = useState(null); // State to hold filtered data, initially null

    const data = [
        { month: 'January', expenses: 1000, invoices: 1500, payments: 1200 },
        { month: 'February', expenses: 1200, invoices: 1700, payments: 1300 },
        { month: 'March', expenses: 1100, invoices: 1600, payments: 1250 },
        { month: 'April', expenses: 1100, invoices: 1600, payments: 1250 },
        { month: 'June', expenses: 1100, invoices: 1600, payments: 1250 },
        { month: 'July', expenses: 1100, invoices: 1600, payments: 1250 },
        { month: 'August', expenses: 1100, invoices: 1600, payments: 1250 },
        // Add more data for other months
    ];

    const handleFilterData = (month) => {
        // Filter the data based on the selected month
        const filtered = data.filter(item => item.month === month);
        setFilteredData(filtered);
    };

    return (
        <div style={{ width: '1000px', height: '400px' }}>
            {/* Add filter buttons */}
            <div>
                {/* <button onClick={() => handleFilterData('January')}>January</button>
                <button onClick={() => handleFilterData('February')}>February</button>
                <button onClick={() => handleFilterData('March')}>March</button>
                <button onClick={() => setFilteredData(null)}>Show All</button> */}
            </div>

            {/* Render the bar chart */}
            <ResponsiveBar
                data={filteredData || data} // Use filtered data if available, otherwise use all data
                keys={['expenses', 'invoices', 'payments']}
                indexBy="month"
                margin={{ top: 50, right: 60, bottom: 50, left: 6 }}
                padding={0.3}
                
                colors={[
                    '#FF5733', // Bright red
                    '#FFC300', // Vivid yellow
                    '#000', // Bright orange
                ]}

                labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: -45,
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                legends={[
                    {
                        dataFrom: 'keys',
                        anchor: 'top-left',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: -50,
                        itemsSpacing: .5,
                        itemWidth: 100,
                        itemHeight: 20,
                        itemDirection: 'left-to-right',
                        itemOpacity: 0.85,
                        symbolSize: 20,
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemOpacity: 1,
                                },
                            },
                        ],
                    },
                ]}
                groupMode="grouped"
                theme={{
                    tooltip: {
                        container: {
                            background: 'white', // Background color of the tooltip container
                            color: 'black', // Text color of the tooltip container
                            fontSize: 12, // Font size of the tooltip text
                            borderRadius: '4px', // Border radius of the tooltip container
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Box shadow of the tooltip container
                            padding: '8px',
                        },
                    },
                }}
            />
        </div>
    );
};

export default BarChart;
