import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/OverviewChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const OverviewChart = () => {
  const [chartData, setChartData] = useState(null);
  const [vendedores, setVendedores] = useState([]);
  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
  const [vendasVendedorData, setVendasVendedorData] = useState(null);

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/sales-data');
        const results = response.data;

        const labels = monthNames;

        const entriesData = new Array(12).fill(0);

        results.forEach(item => {
          const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
          entriesData[monthIndex] = item.total_entries;
        });

        setChartData({
          labels,
          datasets: [
            {
              label: 'Vendas Gerais',
              data: entriesData,
              backgroundColor: 'rgba(150, 90, 200, 0.5)',
              borderColor: 'rgba(150, 90, 200, 1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4
            },
          ],
        });
      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const response = await axios.get('/api/vendedores');
        setVendedores(response.data);
      } catch (error) {
        console.error('Erro ao buscar vendedores:', error);
      }
    };

    fetchVendedores();
  }, []);

  const handleVendedorChange = async (event) => {
    const vendedorId = event.target.value;
    const vendedor = vendedores.find(v => v.id.toString() === vendedorId);

    setVendedorSelecionado(vendedor);

    if (vendedorId) {
      try {
        const response = await axios.get('/api/sales-data-vendedor', { params: { vendedorId } });
        const results = response.data;

        const vendasData = new Array(12).fill(0);
        results.forEach(item => {
          const monthIndex = parseInt(item.month.split('-')[1], 10) - 1;
          vendasData[monthIndex] = item.total_entries;
        });

        setVendasVendedorData({
          labels: monthNames,
          data: vendasData,
        });
      } catch (error) {
        console.error('Erro ao buscar dados do vendedor:', error);
      }
    } else {
      setVendasVendedorData(null);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Visão Geral das Vendas</h2>
      <div className="select-container">
        <label htmlFor="vendedores" className="select-label">Selecione um Vendedor:</label>
        <select
          id="vendedores"
          value={vendedorSelecionado?.id || ''}
          onChange={handleVendedorChange}
          className="select-input"
        >
          <option value="">--Selecione--</option>
          {vendedores.map(vendedor => (
            <option key={vendedor.id} value={vendedor.id}>{vendedor.nome}</option>
          ))}
        </select>
      </div>
      {chartData ? (
        <div style={{ position: 'relative', width: '100%', height: '400px' }}>
          <Line
            data={{
              ...chartData,
              datasets: [
                ...chartData.datasets,
                ...(vendasVendedorData ? [{
                  label: `Vendas do ${vendedorSelecionado?.nome}`,
                  data: vendasVendedorData.data,
                  backgroundColor: 'rgba(100, 200, 150, 0.5)',
                  borderColor: 'rgba(100, 200, 150, 1)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                }] : []),
              ],
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
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
                    text: 'Mês',
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