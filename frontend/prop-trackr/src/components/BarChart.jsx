import { useTheme } from "@mui/material"
import { ResponsiveBar } from "@nivo/bar"
import { tokens } from "../theme";
import { ExpenseData } from "../mock-data/expensedata/expensedata";

const BarChart = () => {
    const theme = useTheme();

    const data = [
        { month: 'January', expenses: 1000, invoices: 1500, payments: 1200 },
        { month: 'February', expenses: 1200, invoices: 1700, payments: 1300 },
        { month: 'March', expenses: 1100, invoices: 1600, payments: 1250 },
        // Add more data for other months
    ];

    return (
        <div style={{ width: '800px', height: '400px' }}>
            <ResponsiveBar
                data={data}
                keys={['expenses', 'invoices', 'payments']}
                indexBy="month"
                margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
                padding={0.3}
                colors={{ scheme: 'category10' }} // You can adjust the color scheme as needed
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
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 120,
                        translateY: 0,
                        itemsSpacing: 2,
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
                groupMode="grouped" // Display bars grouped
            />
        </div>
    );
};

export default BarChart