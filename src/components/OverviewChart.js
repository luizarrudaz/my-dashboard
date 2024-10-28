import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OverviewChart = ({ view }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sales-data', { params: { view: view === 'Por Ano' ? 'year' : 'month' } });
        const results = response.data;

        const labels = results.map(item => (view === 'Por Ano' ? item.year : item.month));
        const entriesData = results.map(item => item.total_entries); // Use total_entries

        setChartData({
          labels,
          datasets: [
            {
              label: 'Vendas',
              data: entriesData, // Alterado para entradas
              backgroundColor: 'rgba(150, 90, 200, 0.5)',
              borderColor: 'rgba(150, 90, 200, 1)',
              borderWidth: 2,
              fill: true,
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };

    fetchData();
  }, [view]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Visão Geral das Vendas</h2>
      {chartData ? (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false, // Permitir que o gráfico se ajuste ao tamanho do contêiner
              plugins: {
                legend: {
                  position: 'top',
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Vendas',
                  },
                },
                x: {
                  title: {
                    display: true,
                    text: view === 'Por Ano' ? 'Ano' : 'Mês',
                  },
                },
              },
            }}
          />
        </div>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default OverviewChart;
