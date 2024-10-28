// src/pages/Home.js
import React from 'react';
import SalesSummary from '../components/SalesSummary';
import Chart from '../components/BarChart';
import OverviewChart from '../components/OverviewChart';

const Home = () => {
  return (
    <div style={{ backgroundColor: '#1E1E1E' }}>
      <SalesSummary />
      <br></br>
      <Chart />
      <br></br>
      <OverviewChart />
    </div>
  );
};

export default Home;
