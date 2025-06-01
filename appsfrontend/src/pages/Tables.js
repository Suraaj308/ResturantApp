import React, { useState, useEffect } from 'react';
import TableUnit from './TableUnit';
import './Tables.css';

const Table = () => {
    const [tables, setTables] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTable, setNewTable] = useState({
        tableName: '',
        chairCount: 2,
    });

    const fetchTables = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tables');
            const data = await response.json();
            if (data.success) {
                const tablesWithFakeName = data.data.map((table, index) => ({
                    ...table,
                    fakeName: index + 1,
                }));
                setTables(tablesWithFakeName);
                setNewTable((prev) => ({
                    ...prev,
                    tableName: (tablesWithFakeName.length + 1).toString(),
                }));
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tables/${id}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (data.success) {
                fetchTables();
            }
        } catch (error) {
            console.error('Error deleting table:', error);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tables', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTable),
            });
            const data = await response.json();
            if (data.success) {
                setShowModal(false);
                fetchTables();
            }
        } catch (error) {
            console.error('Error creating table:', error);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTable((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const renderTableRows = () => {
        const rows = [];
        for (let i = 0; i < tables.length; i += 7) {
            const rowTables = tables.slice(i, i + 7);
            rows.push(
                <div className="table-row" key={i}>
                    {rowTables.map((table) => (
                        <TableUnit key={table._id} table={table} onDelete={handleDelete} />
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="table-container">
            {renderTableRows()}
            <button className="add-table-btn" onClick={openModal}>
                +
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Create New Table</h2>
                        <div className="form-group">
                            <label>Table Name</label>
                            <input
                                type="text"
                                name="tableName"
                                value={newTable.tableName}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Chair Count</label>
                            <select
                                name="chairCount"
                                value={newTable.chairCount}
                                onChange={handleInputChange}
                            >
                                <option value={2}>2</option>
                                <option value={4}>4</option>
                                <option value={6}>6</option>
                                <option value={8}>8</option>
                            </select>
                        </div>
                        <div className="modal-actions">
                            <button className="create-btn" onClick={handleCreate}>
                                Create
                            </button>
                            <button className="cancel-btn" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Table;