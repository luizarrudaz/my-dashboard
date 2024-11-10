CREATE TABLE vendedores (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	sobrenome VARCHAR(255) NOT NULL,
	rg VARCHAR(11) NOT NULL UNIQUE,
	cpf VARCHAR(11) NOT NULL UNIQUE
);

CREATE TABLE categorias (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE produtos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nome VARCHAR(255) NOT NULL,
	descricao VARCHAR(255) NOT NULL,
	categoria_id INT,
	preco DECIMAL(10, 2) NOT NULL,
	vendedor_id INT,
	FOREIGN KEY (categoria_id) REFERENCES categorias(id),
	FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);

CREATE TABLE vendas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	produto_id INT,
	vendedor_id INT,
	quantidade INT NOT NULL,
	data_venda DATE NOT NULL,
	FOREIGN KEY (produto_id) REFERENCES produtos(id),
	FOREIGN KEY (vendedor_id) REFERENCES vendedores(id)
);