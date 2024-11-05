import { Chart as ChartJS, CategoryScale, LinearScale, LogarithmicScale, BarElement, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, LogarithmicScale, BarElement, Tooltip);

const ChartComponent = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await fetch('api/chart-data');
        const data = await response.json();
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Quantidade Vendida',
              data: data.quantities.map(Number),
              backgroundColor: 'rgba(150, 90, 200, 0.5)',
              borderColor: 'rgba(150, 90, 200, 1)',
              borderWidth: 1,
            },
            {
              label: 'Rendimento',
              data: data.revenues.map((value) => Number(value.replace(/\./g, '').replace(',', '.'))),
              backgroundColor: 'rgba(100, 200, 150, 0.5)',
              borderColor: 'rgba(100, 200, 150, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Erro ao carregar dados do gráfico:", error);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h2>Gráfico de Vendas e Rendimento por Produto</h2>
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    const productIndex = tooltipItems[0].dataIndex;
                    return chartData.labels[productIndex];
                  },
                  label: (context) => {
                    if (context.dataset.label === 'Rendimento') {
                      return `${context.dataset.label}: R$ ${new Intl.NumberFormat('pt-BR').format(context.raw)}`;
                    }
                    return `${context.dataset.label}: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: { display: false },
                ticks: { display: true, autoSkip: true },
              },
              y: {
                title: { display: true, text: 'Valores' },
                type: 'logarithmic', 
                beginAtZero: true,
                min: 0, 
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ChartComponent;