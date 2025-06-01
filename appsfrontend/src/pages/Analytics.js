// Analytics.js
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import './Analytics.css';

const Analytics = () => {
    const [orders, setOrders] = useState([]);
    const [chefs, setChefs] = useState([]);
    const [tables, setTables] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch orders
                const ordersResponse = await fetch('http://localhost:5000/api/orders');
                if (!ordersResponse.ok) throw new Error('Failed to fetch orders');
                const ordersData = await ordersResponse.json();

                // Fetch chefs
                const chefsResponse = await fetch('http://localhost:5000/api/chefs');
                if (!chefsResponse.ok) throw new Error('Failed to fetch chefs');
                const chefsData = await chefsResponse.json();

                // Fetch tables
                const tablesResponse = await fetch('http://localhost:5000/api/tables');
                if (!tablesResponse.ok) throw new Error('Failed to fetch tables');
                const tablesData = await tablesResponse.json();

                // Assign fakeNumber and bookingStatus to tables
                const tablesWithFakeNumber = tablesData.data.map((table, index) => ({
                    ...table,
                    fakeNumber: index + 1,
                    bookingStatus: 'N', // Default: Not booked
                }));

                // Update bookingStatus for tables with active DineIn orders
                const currentTime = new Date('2025-06-01T14:22:00+05:30'); // IST time
                const activeDineInOrders = ordersData.filter((order) => {
                    if (order.orderType !== 'DineIn') return false;
                    const orderedTime = new Date(order.orderedTime);
                    const estimatedTime = new Date(orderedTime.getTime() + order.orderPrepTime * 60 * 1000);
                    return currentTime < estimatedTime; // Order is not done yet
                });

                const updatedTables = tablesWithFakeNumber.map((table) => {
                    const isBooked = activeDineInOrders.some(
                        (order) => order.tableNumber === table.tableName
                    );
                    return {
                        ...table,
                        bookingStatus: isBooked ? 'B' : 'N',
                    };
                });

                setOrders(ordersData);
                setChefs(chefsData);
                setTables(updatedTables);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchData();
    }, []);

    // Process data for analytics
    const totalChefs = chefs.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.orderPrice, 0);
    const totalOrders = orders.length;
    const uniqueClients = new Set(orders.map((order) => order.customerMobileNumber)).size;

    // Calculate order types and status
    const dineInOrders = orders.filter((order) => order.orderType === 'DineIn').length;
    const TakeAwayOrders = orders.filter((order) => order.orderType === 'TakeAway').length;
    const doneOrders = orders.filter((order) => {
        const orderedTime = new Date(order.orderedTime);
        const estimatedTime = new Date(orderedTime.getTime() + order.orderPrepTime * 60 * 1000);
        const currentTime = new Date('2025-06-01T14:22:00+05:30'); // IST time
        return currentTime >= estimatedTime;
    }).length;

    // Calculate total for pie chart denominator
    const totalPieOrders = dineInOrders + TakeAwayOrders + doneOrders;

    // Data for pie chart
    const pieData = [
        {
            name: 'DineIn',
            value: dineInOrders,
            percentage: totalPieOrders ? ((dineInOrders / totalPieOrders) * 100).toFixed(1) : 0
        },
        {
            name: 'TakeAway',
            value: TakeAwayOrders,
            percentage: totalPieOrders ? ((TakeAwayOrders / totalPieOrders) * 100).toFixed(1) : 0
        },
        {
            name: 'Done',
            value: doneOrders,
            percentage: totalPieOrders ? ((doneOrders / totalPieOrders) * 100).toFixed(1) : 0
        },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    // Calculate revenue by weekday for the past 7 days
    const today = new Date('2025-06-01T14:22:00+05:30'); // IST time
    const pastWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        return date;
    }).reverse(); // Oldest to newest

    const revenueByDay = pastWeek.map((date) => {
        const dayName = date.toLocaleString('en-US', { weekday: 'short' });
        const dayOrders = orders.filter((order) => {
            const orderDate = new Date(order.orderedTime);
            return (
                orderDate.getFullYear() === date.getFullYear() &&
                orderDate.getMonth() === date.getMonth() &&
                orderDate.getDate() === date.getDate()
            );
        });
        const revenue = dayOrders.reduce((sum, order) => sum + order.orderPrice, 0);
        return { day: dayName, revenue };
    });

    // Render table squares in rows (7 per row)
    const renderTableRows = () => {
        const rows = [];
        for (let i = 0; i < tables.length; i += 7) {
            const rowTables = tables.slice(i, i + 7);
            rows.push(
                <div className="table-row" key={i}>
                    {rowTables.map((table) => (
                        <div
                            key={table._id}
                            className="table-square"
                            style={{
                                backgroundColor: table.bookingStatus === 'B' ? '#28a745' : '#d3d3d3',
                            }}
                        >
                            <span>Table {table.fakeNumber}</span>
                        </div>
                    ))}
                </div>
            );
        }
        return rows;
    };

    return (
        <div className="analytics-container">
            <h1>Analytics Page</h1>
            {error ? (
                <div className="error">Error: {error}</div>
            ) : (
                <>
                    {/* Top Section: 4 Boxes */}
                    <div className="top-section">
                        <div className="box">
                            <h3>Total Chefs</h3>
                            <p>{totalChefs}</p>
                        </div>
                        <div className="box">
                            <h3>Total Revenue</h3>
                            <p>₹{totalRevenue}</p>
                        </div>
                        <div className="box">
                            <h3>Total Orders</h3>
                            <p>{totalOrders}</p>
                        </div>
                        <div className="box">
                            <h3>Total Clients</h3>
                            <p>{uniqueClients}</p>
                        </div>
                    </div>

                    {/* Middle Section: 3 Boxes */}
                    <div className="middle-section">
                        {/* Pie Chart */}
                        <div className="chart-box">
                            <h3>Order Distribution</h3>
                            <PieChart width={300} height={200}>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend />
                            </PieChart>
                            <div className="progress-bars">
                                {pieData.map((entry, index) => (
                                    <div key={entry.name} className="progress-bar-container">
                                        <span>{entry.name}: {entry.percentage}%</span>
                                        <div className="progress-bar">
                                            <div
                                                className="progress-fill"
                                                style={{ width: `${entry.percentage}%`, backgroundColor: COLORS[index] }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Bar Graph */}
                        <div className="chart-box">
                            <h3>Revenue by Weekday</h3>
                            <BarChart width={300} height={200} data={revenueByDay}>
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </div>

                        {/* Table Squares */}
                        <div className="chart-box">
                            <h3>Table Status</h3>
                            <div className="table-grid">
                                {renderTableRows()}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Section: Chefs Table */}
                    <div className="bottom-section">
                        <h3>Chefs Performance</h3>
                        <table className="chefs-table">
                            <thead>
                                <tr>
                                    <th>Chef Name</th>
                                    <th>Number of Orders</th>
                                </tr>
                            </thead>
                            <tbody>
                                {chefs.map((chef) => (
                                    <tr key={chef._id}>
                                        <td>{chef.chefName}</td>
                                        <td>{chef.numberOfOrders}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default Analytics;