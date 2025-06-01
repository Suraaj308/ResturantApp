// OrdersTicket.js
import React, { useState, useEffect } from 'react';
import Ticket from './Ticket';
import './OrderTickets';

const OrderTickets = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ticketsPerPage = 8; // 4x2 matrix

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/orders');
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                const data = await response.json();
                // Sort orders by orderedTime (latest first)
                const sortedOrders = data.sort(
                    (a, b) => new Date(b.orderedTime) - new Date(a.orderedTime)
                );
                setOrders(sortedOrders);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchOrders();
    }, []);

    // Pagination logic
    const totalPages = Math.ceil(orders.length / ticketsPerPage);
    const startIndex = (currentPage - 1) * ticketsPerPage;
    const currentOrders = orders.slice(startIndex, startIndex + ticketsPerPage);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="orders-ticket-container">
            <div>
                <h2>OrderLine</h2>
            </div>
            <div>
                {error ? (
                    <div>Error: {error}</div>
                ) : orders.length === 0 ? (
                    <div>No orders found</div>
                ) : (
                    <>
                        <div className="tickets-grid">
                            {currentOrders.map((order) => (
                                <Ticket key={order._id} order={order} />
                            ))}
                        </div>
                        <div className="pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Previous
                            </button>
                            <span>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default OrderTickets;