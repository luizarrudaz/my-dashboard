import React, { useEffect, useState } from 'react';

const SalesSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const response = await fetch('/api/summary');
        if (!response.ok) {
          throw new Error('Erro ao carregar resumo de vendas');
        }
        const data = await response.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) return <p>Carregando resumo de vendas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1>Dashboard de Vendas</h1>
      <h2>Resumo de Vendas</h2>
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '900px' }}>
        <div style={cardStyle}>
          <h3>Total de Produtos</h3>
          <p>{summary.totalProducts}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total de Vendas</h3>
          <p>{summary.totalSales}</p>
        </div>
        <div style={cardStyle}>
          <h3>Total de Receita Líquida</h3>
          <p>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalRevenue)}</p>
        </div>
      </div>
    </div>
  );
};

const cardStyle = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '20px',
  margin: '10px',
  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  width: '200px',
  textAlign: 'center'
};

export default SalesSummary;