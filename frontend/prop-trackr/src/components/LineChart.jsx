import React from 'react';
import { ResponsiveLine } from '@nivo/line';

const OccupiedVsUnoccupiedUnitsChart = () => {
  // Dummy data for testing
  const data = [
    {
      id: 'occupied_units',
      data: [
        { x: 'January', y: 10 },
        { x: 'February', y: 15 },
        { x: 'March', y: 20 },
        { x: 'April', y: 18 },
        { x: 'May', y: 25 },
        // Add more data points for other months as needed
      ],
    },
    {
      id: 'unoccupied_units',
      data: [
        { x: 'January', y: 5 },
        { x: 'February', y: 8 },
        { x: 'March', y: 6 },
        { x: 'April', y: 10 },
        { x: 'May', y: 7 },
        // Add more data points for other months as needed
      ],
    },
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 60, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
        curve="monotoneX"
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
          legend: 'Month',
          legendOffset: 36,
          legendPosition: 'middle',
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Units',
          legendOffset: -40,
          legendPosition: 'middle',
        }}
        colors={{ scheme: 'category10' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'row',
            justify: false,
            translateX: 0,
            translateY: 50,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1,
                },
              },
            ],
          },
        ]}
      />
    </div>
  );
};

export default OccupiedVsUnoccupiedUnitsChart;
