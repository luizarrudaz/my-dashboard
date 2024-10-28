import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

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
              label: 'Vendas',
              data: data.values.map(value => Number(value)),
              backgroundColor: 'rgba(150, 90, 200, 0.5)',
              borderColor: 'rgba(150, 90, 200, 1)',
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
      <h2>Gráfico de Vendas por Produto</h2>
      <div style={{ position: 'relative', width: '100%', height: '400px' }}>
        <Bar 
          data={chartData} 
          options={{
            responsive: true,
            maintainAspectRatio: false, // Permitir que o gráfico se ajuste ao tamanho do contêiner
            plugins: {
              tooltip: {
                callbacks: {
                  title: (tooltipItems) => {
                    const productIndex = tooltipItems[0].dataIndex;
                    return chartData.labels[productIndex];
                  },
                  label: (context) => {
                    return `Vendas: ${context.raw}`;
                  },
                },
              },
            },
            scales: {
              x: {
                title: {
                  display: false,
                },
                ticks: {
                  display: false,
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Quantidade de Vendas'
                }
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default ChartComponent;
