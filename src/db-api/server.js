const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Config@123',
    database: 'dashboard-vendas',
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL!');
});

// Rota para a raiz da aplicação
app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.get('/api/produtos', (req, res) => {
    const sql = 'SELECT * FROM produtos';

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error('Erro ao consultar produtos:', err);
            return res.status(500).json({ error: 'Erro ao consultar produtos' });
        }

        const produtosComPreco = resultados.map(produto => ({
            ...produto,
            preco: isNaN(produto.preco) ? 'N/A' : parseFloat(produto.preco).toFixed(2)
        }));

        res.json(produtosComPreco);
    });
});

app.get('/api/reports', (req, res) => {
    const query = `
      SELECT produtos.nome AS nome_produto, vendas.data_venda, vendas.quantidade AS quantidade_vendida,
             (vendas.quantidade * produtos.preco) AS preco_total, vendedores.nome AS nome_vendedor
      FROM vendas
      INNER JOIN produtos ON vendas.produto_id = produtos.id
      INNER JOIN vendedores ON vendas.vendedor_id = vendedores.id
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar vendas:', err);
            res.status(500).json({ error: 'Erro ao buscar vendas' });
        } else {
            res.json(results);
        }
    });
});


app.get('/api/sales-summary', (req, res) => {
    const query = `
      SELECT vendedores.nome AS nome_vendedor, 
             COALESCE(SUM(vendas.quantidade), 0) AS quantidade_total,
             COALESCE(SUM(vendas.quantidade * produtos.preco), 0) AS total_vendido
      FROM vendedores
      LEFT JOIN vendas ON vendedores.id = vendas.vendedor_id
      LEFT JOIN produtos ON vendas.produto_id = produtos.id
      GROUP BY vendedores.id
      ORDER BY total_vendido DESC;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao recuperar resumo de vendas:", err);
            res.status(500).json({ error: "Erro ao recuperar resumo de vendas" });
        } else {
            res.json(results);
        }
    });
});

app.get('/api/summary', (req, res) => {
    const sql = `
      SELECT 
        (SELECT COUNT(*) FROM produtos) AS totalProducts,
        (SELECT COUNT(*) FROM vendas) AS totalSales,
        (SELECT SUM(preco * quantidade) 
        FROM 
            vendas v 
        JOIN 
            produtos p ON v.produto_id = p.id) AS totalRevenue
    `;

    db.query(sql, (err, resultados) => {
        if (err) {
            console.error('Erro ao consultar resumo:', err);
            return res.status(500).json({ error: 'Erro ao consultar resumo' });
        }

        res.json(resultados[0]);
    });
});

app.get('/api/chart-data', (req, res) => {
    const query = `
        SELECT 
            p.nome AS produto,
            SUM(v.quantidade) AS total_vendas
        FROM 
            produtos p
        JOIN 
            vendas v ON p.id = v.produto_id
        GROUP BY 
            p.id, p.nome
        ORDER BY 
            p.nome;
    `;

    db.query(query, (error, results) => {
        if (error) {
            console.error("Erro ao executar a consulta:", error);
            return res.status(500).json({ error: 'Erro ao buscar dados do gráfico' });
        }
        const labels = results.map(row => row.produto);
        const values = results.map(row => row.total_vendas);
        res.json({ labels, values });
    });
});

app.get('/api/sales-data', (req, res) => {
    const { view } = req.query;

    let query;
    if (view === 'year') {
        query = `
            SELECT YEAR(data_venda) AS year, COUNT(*) AS total_entries
            FROM vendas
            GROUP BY year
            ORDER BY year
        `;
    } else {
        query = `
            SELECT DATE_FORMAT(data_venda, '%Y-%m') AS month, COUNT(*) AS total_entries
            FROM vendas
            GROUP BY month
            ORDER BY month
        `;
    }

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao buscar dados de vendas:', err);
            return res.status(500).json({ error: 'Erro ao buscar dados de vendas' });
        }
        res.json(results);
    });
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});