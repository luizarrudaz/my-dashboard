// src/components/DateFilter.js
import React from 'react';

const DateFilter = ({ startDate, endDate, onDateChange }) => {
  return (
    <div>
      <h2>Filtrar por Data</h2>
      <label>
        Data de Início:
        <input type="date" value={startDate} onChange={(e) => onDateChange(e.target.value, endDate)} />
      </label>
      <label>
        Data de Fim:
        <input type="date" value={endDate} onChange={(e) => onDateChange(startDate, e.target.value)} />
      </label>
    </div>
  );
};

export default DateFilter;
