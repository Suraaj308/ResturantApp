import React from 'react';
import './TableUnit.css';

const TableUnit = ({ table, onDelete }) => {
    return (
        <div className="table-unit">
            <h3>Table {table.fakeName}</h3>
            <button className="delete-btn" onClick={() => onDelete(table._id)}>
                ×
            </button>
            <span className="chair-count">{table.chairCount} chairs</span>
        </div>
    );
};

export default TableUnit;