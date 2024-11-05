import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VendedorSelector = ({ onSelect }) => {
    const [vendedores, setVendedores] = useState([]);

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

    return (
        <select onChange={(e) => onSelect(e.target.value)} defaultValue="">
            <option value="" disabled>Selecione um vendedor</option>
            {vendedores.map(vendedor => (
                <option key={vendedor.id} value={vendedor.id}>
                    {vendedor.nome} {vendedor.sobrenome}
                </option>
            ))}
        </select>
    );
};

export default VendedorSelector;