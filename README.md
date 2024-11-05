# Documentação do Projeto de Dashboard

## Visão Geral
O projeto de dashboard é uma aplicação web que permite a visualização e análise de dados de vendas. O objetivo é fornecer uma interface intuitiva para que os usuários possam acompanhar o desempenho de vendas em tempo real, identificar tendências e gerar relatórios detalhados.

## Funcionalidades

- **Visualização de Vendas**: Oferece uma interface interativa para visualizar as vendas de produtos em diversos formatos de gráfico, como barras e linhas, facilitando a análise de tendências.
- **Filtros de Dados**: Os usuários podem aplicar filtros personalizados para visualizar as vendas com base em critérios específicos, como data, vendedor, categoria e outros parâmetros relevantes.
- **Relatórios Personalizados**: Geração de relatórios detalhados que apresentam o total vendido por cada vendedor, permitindo que os usuários ordenem e organizem os resultados de acordo com suas necessidades.
- **Exportação para PDF**: Os relatórios podem ser facilmente exportados em formato PDF, permitindo compartilhamento e impressão de maneira prática.
- **Design Responsivo**: A aplicação possui um design responsivo, garantindo que todas as funcionalidades sejam acessíveis e funcionais em dispositivos móveis e desktops, melhorando a experiência do usuário.


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
