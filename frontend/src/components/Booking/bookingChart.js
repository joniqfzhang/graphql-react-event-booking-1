import React from 'react';
import { Bar as BarChart } from 'react-chartjs-2';
import './bookingChart.css';

const BOOKING_BUCKETS = {
  Cheap: { min: 0, max: 100 },
  Normal: { min: 100, max: 200 },
  Expensive: { min: 200, max: 1000000 },
};

const bookingChart = (props) => {
  const chartData = { labels: [], datasets: [] };
  let values = [];
  for (const bucket in BOOKING_BUCKETS) {
    const filteredBookingCount = props.bookings.reduce((prev, current) => {
      if (
        current.event.price > BOOKING_BUCKETS[bucket].min &&
        current.event.price < BOOKING_BUCKETS[bucket].max
      ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0);
    values.push(filteredBookingCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      barPercentage: 0.5,
      barThickness: 6,
      maxBarThickness: 8,
      minBarLength: 2,
      data: values,
    });
    values = [...values];
    values[values.length - 1] = 0;
    console.log(chartData);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <BarChart data={chartData} />
    </div>
  );
};

export default bookingChart;
