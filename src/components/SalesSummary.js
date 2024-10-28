// src/components/SalesSummary.js
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
    <div>
      <h1>Dashboard de Vendas</h1>
      <h2>Resumo de Vendas</h2>
      <p>Total de Produtos: {summary.totalProducts}</p>
      <p>Total de Vendas: {summary.totalSales}</p>
      <p>Total de Receita Líquida: {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.totalRevenue)}</p>
    </div>
  );
};

export default SalesSummary;
