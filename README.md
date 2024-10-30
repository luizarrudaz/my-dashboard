# Documentação do Projeto de Dashboard

## Visão Geral
O projeto de dashboard é uma aplicação web que permite a visualização e análise de dados de vendas. O objetivo é fornecer uma interface intuitiva para que os usuários possam acompanhar o desempenho de vendas em tempo real, identificar tendências e gerar relatórios detalhados.

## Funcionalidades
- **Visualização de Vendas**: Permite visualizar as vendas de produtos em diferentes formatos de gráfico (ex.: barras, linhas).
- **Filtros de Dados**: Os usuários podem filtrar as vendas por diferentes critérios, como data, vendedor e categoria.
- **Relatórios**: Geração de relatórios que mostram o total vendido por cada vendedor, possibilitando ordenar os resultados.
- **Responsividade**: O design é responsivo, garantindo que a aplicação funcione bem em dispositivos móveis e desktops.

## Tecnologias Utilizadas

### Frontend
- **React**: Biblioteca para a construção de interfaces de usuário.
- **Chart.js**: Biblioteca para a criação de gráficos interativos.
- **CSS**: Para estilização da interface.

### Backend
- **Node.js**: Ambiente de execução para JavaScript no servidor.
- **Express.js**: Framework para construção de APIs.
- **MySQL**: Banco de dados relacional utilizado para armazenar informações sobre vendas, produtos e vendedores.

-----------------------------------------
# Instalação das Dependências do Node
### `npm install` `npm start`

### Necessário instalação do Banco de Dados
- Instale o MySQL Workbench, crie seu banco e rode em sequência os scripts create e insert.
- Altere seus dados de connect em: src/db-api/server.js

# Instancie o Banco de Dados
### `node server.js`
