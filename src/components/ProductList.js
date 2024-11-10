import React, { useEffect, useState } from 'react';
import '../styles/ProductList.css';

const ProductList = () => {
  const [produtos, setProdutos] = useState([]);
  const [filteredProdutos, setFilteredProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [nomeFilter, setNomeFilter] = useState('');
  const [categoriaFilter, setCategoriaFilter] = useState('');
  const [vendasFilter, setVendasFilter] = useState('');
  const [precoFilter, setPrecoFilter] = useState('');

  const [sortColumn, setSortColumn] = useState('nome');
  const [sortDirection, setSortDirection] = useState('asc');

  // const categorias = {
  //   1: "Notebooks",
  //   2: "Perifericos",
  //   3: "Desktops",
  // };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await fetch('/api/produtos');
        if (!response.ok) {
          throw new Error('Erro ao carregar produtos');
        }
        const data = await response.json();
        console.log('Dados carregados:', data);
        setProdutos(data);
        setFilteredProdutos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  useEffect(() => {
    const filtered = produtos.filter(produto => {
      const nomeMatch = !nomeFilter || (produto.nome && produto.nome.toLowerCase().includes(nomeFilter.toLowerCase()));
      const categoriaMatch = !categoriaFilter ||
        (produto.categoria_id && produto.categoria_id.toLowerCase().includes(categoriaFilter.toLowerCase()));
      const vendasMatch = !vendasFilter || (produto.total_vendas && produto.total_vendas.toString().includes(vendasFilter));
      const precoMatch = !precoFilter ||
        (!isNaN(precoFilter) && produto.preco && produto.preco.toString().includes(precoFilter));

      return nomeMatch && categoriaMatch && vendasMatch && precoMatch;
    });

    const sorted = filtered.sort((a, b) => {
      const aValue = a[sortColumn] !== undefined && a[sortColumn] !== null ? a[sortColumn] : '';
      const bValue = b[sortColumn] !== undefined && b[sortColumn] !== null ? b[sortColumn] : '';

      const isNumberColumn = sortColumn === 'total_vendas' || sortColumn === 'preco';

      if (isNumberColumn) {
        return sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      } else {
        const aCompareValue = aValue.toString().toLowerCase();
        const bCompareValue = bValue.toString().toLowerCase();

        return sortDirection === 'asc'
          ? aCompareValue.localeCompare(bCompareValue)
          : bCompareValue.localeCompare(aCompareValue);
      }
    });

    setFilteredProdutos(sorted);
  }, [nomeFilter, categoriaFilter, vendasFilter, precoFilter, produtos, sortColumn, sortDirection]);

  const handleSort = (column) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);
  };

  const clearFilters = () => {
    setNomeFilter('');
    setCategoriaFilter('');
    setVendasFilter('');
    setPrecoFilter('');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const inputs = document.querySelectorAll('input');
      const isClickInside = Array.from(inputs).some(input => input.contains(event.target));
      if (!isClickInside) {
        clearFilters();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (loading) return <p>Carregando produtos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="product-container">
      <h1>Lista de Produtos</h1>
      <div className="sub-container">
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('nome')}>
                Produto {sortColumn === 'nome' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th>Descrição</th>
              <th onClick={() => handleSort('categoria_id')}>
                Categoria {sortColumn === 'categoria_id' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('preco')}>
                Preço {sortColumn === 'preco' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th onClick={() => handleSort('total_vendas')}>
                Vendas {sortColumn === 'total_vendas' ? (sortDirection === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
            <tr>
              <th>
                <input
                  type="text"
                  placeholder="Filtrar por nome"
                  value={nomeFilter}
                  onChange={(e) => setNomeFilter(e.target.value)}
                />
              </th>
              <th></th>
              <th>
                <input
                  type="text"
                  placeholder="Filtrar por categoria"
                  value={categoriaFilter}
                  onChange={(e) => setCategoriaFilter(e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Filtrar por preço"
                  value={precoFilter}
                  onChange={(e) => setPrecoFilter(e.target.value)}
                />
              </th>
              <th>
                <input
                  type="text"
                  placeholder="Filtrar por vendas"
                  value={vendasFilter}
                  onChange={(e) => setVendasFilter(e.target.value)}
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProdutos.length > 0 ? (
              filteredProdutos.map((produto) => (
                <tr key={produto.id}>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>{produto.categoria_id}</td>
                  <td>R${parseFloat(produto.preco).toFixed(2)}</td>
                  <td>{produto.total_vendas}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;