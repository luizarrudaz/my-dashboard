import React, { useEffect, useState } from 'react';
import '../styles/SalesReport.css';

const SalesReport = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nomeProdutoFilter, setNomeProdutoFilter] = useState('');
  const [vendedorFilter, setVendedorFilter] = useState('');
  const [dataVendaFilter, setDataVendaFilter] = useState('');

  const [summaryVendedorFilter, setSummaryVendedorFilter] = useState('');

  const [sortColumn, setSortColumn] = useState('nome_produto');
  const [sortDirection, setSortDirection] = useState('asc');

  const [salesSummary, setSalesSummary] = useState([]);
  const [summarySortColumn, setSummarySortColumn] = useState('total_vendido');
  const [summarySortDirection, setSummarySortDirection] = useState('desc');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await fetch('/api/reports');
        if (!response.ok) throw new Error('Erro ao carregar vendas');
        const data = await response.json();
        setSales(data);
        setFilteredSales(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchSalesSummary = async () => {
      try {
        const response = await fetch('/api/sales-summary');
        if (!response.ok) throw new Error('Erro ao carregar o resumo de vendas');
        const data = await response.json();
        setSalesSummary(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSales();
    fetchSalesSummary();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const filterInputs = [
        document.getElementById('nomeProdutoFilter'),
        document.getElementById('vendedorFilter'),
        document.getElementById('dataVendaFilter'),
        document.getElementById('summaryVendedorFilter'),
      ];

      if (filterInputs.every(input => input && !input.contains(event.target))) {
        clearFilters();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const clearFilters = () => {
    setNomeProdutoFilter('');
    setVendedorFilter('');
    setDataVendaFilter('');
    setSummaryVendedorFilter('');
  };

  useEffect(() => {
    const filtered = sales.filter(sale => {
      const nomeProdutoMatch = !nomeProdutoFilter || sale.nome_produto.toLowerCase().includes(nomeProdutoFilter.toLowerCase());
      const vendedorMatch = !vendedorFilter || sale.nome_vendedor.toLowerCase().includes(vendedorFilter.toLowerCase());
      const dataVendaMatch = !dataVendaFilter || new Date(sale.data_venda).toLocaleDateString('pt-BR').includes(dataVendaFilter);
      return nomeProdutoMatch && vendedorMatch && dataVendaMatch;
    });

    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortColumn] !== undefined && a[sortColumn] !== null ? a[sortColumn] : '';
      const bValue = b[sortColumn] !== undefined && b[sortColumn] !== null ? b[sortColumn] : '';
      return sortColumn === 'data_venda'
        ? sortDirection === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue)
        : sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
    });

    setFilteredSales(sorted);
  }, [nomeProdutoFilter, vendedorFilter, dataVendaFilter, sales, sortColumn, sortDirection]);

  useEffect(() => {
    const filteredSummary = salesSummary.filter(summary => {
      return !summaryVendedorFilter || summary.nome_vendedor.toLowerCase().includes(summaryVendedorFilter.toLowerCase());
    });

    setSalesSummary(filteredSummary);
    
    if (!summaryVendedorFilter) {
      const fetchSalesSummary = async () => {
        try {
          const response = await fetch('/api/sales-summary');
          if (!response.ok) throw new Error('Erro ao carregar o resumo de vendas');
          const data = await response.json();
          setSalesSummary(data);
        } catch (err) {
          setError(err.message);
        }
      };

      fetchSalesSummary();
    }
  }, [summaryVendedorFilter]);

  const handleSort = (column) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const handleSummarySort = (column) => {
    const newDirection = summarySortColumn === column && summarySortDirection === 'asc' ? 'desc' : 'asc';
    setSummarySortColumn(column);
    setSummarySortDirection(newDirection);
    const sortedSummary = [...salesSummary].sort((a, b) =>
      newDirection === 'asc'
        ? a[column] - b[column]
        : b[column] - a[column]
    );
    setSalesSummary(sortedSummary);
  };

  if (loading) return <p>Carregando vendas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="sales-report-container">
      <h1>Resumo de Vendas por Vendedor</h1>
  
      <div className="sales-report-sub-container-1">
        <table className="sales-summary-table">
          <thead>
            <tr>
              <th onClick={() => handleSummarySort('nome_vendedor')}>Nome do Vendedor {summarySortColumn === 'nome_vendedor' ? (summarySortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSummarySort('quantidade_total')}>Quantidade Total de Itens Vendidos {summarySortColumn === 'quantidade_total' ? (summarySortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSummarySort('total_vendido')}>Total Vendido {summarySortColumn === 'total_vendido' ? (summarySortDirection === 'asc' ? '↑' : '↓') : ''}</th>
            </tr>
            <tr>
              <th>
                <input id="summaryVendedorFilter" type="text" value={summaryVendedorFilter} onChange={(e) => setSummaryVendedorFilter(e.target.value)} placeholder="Filtrar por Nome do Vendedor" />
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {salesSummary.map((summary, index) => (
              <tr key={index}>
                <td>{summary.nome_vendedor}</td>
                <td>{summary.quantidade_total}</td>
                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(summary.total_vendido)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      <h1>Relatório de Vendas</h1>
  
      <div className="sales-report-sub-container-2">
        <table className="sales-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('nome_produto')}>Nome do Produto {sortColumn === 'nome_produto' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th onClick={() => handleSort('data_venda')}>Data da Venda {sortColumn === 'data_venda' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
              <th>Quantidade Vendida</th>
              <th>Preço Total</th>
              <th onClick={() => handleSort('nome_vendedor')}>Nome do Vendedor {sortColumn === 'nome_vendedor' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}</th>
            </tr>
            <tr>
              <th>
                <input id="nomeProdutoFilter" type="text" value={nomeProdutoFilter} onChange={(e) => setNomeProdutoFilter(e.target.value)} placeholder="Filtrar por Nome do Produto" />
              </th>
              <th>
                <input id="dataVendaFilter" type="text" value={dataVendaFilter} onChange={(e) => setDataVendaFilter(e.target.value)} placeholder="Filtrar por Data da Venda" />
              </th>
              <th></th>
              <th></th>
              <th>
                <input id="vendedorFilter" type="text" value={vendedorFilter} onChange={(e) => setVendedorFilter(e.target.value)} placeholder="Filtrar por Nome do Vendedor" />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.nome_produto}</td>
                <td>{new Date(sale.data_venda).toLocaleDateString('pt-BR')}</td>
                <td>{sale.quantidade_vendida}</td>
                <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sale.preco_total)}</td>
                <td>{sale.nome_vendedor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )}

export default SalesReport;