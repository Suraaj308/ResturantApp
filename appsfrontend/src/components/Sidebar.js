import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2 className="logo">MyApp</h2>
            <nav>
                <NavLink to="/stats" end className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
                <NavLink to="/tables" className={({ isActive }) => isActive ? 'active' : ''}>Tables</NavLink>
                <NavLink to="/ordertickets" className={({ isActive }) => isActive ? 'active' : ''}>OrdersTickets</NavLink>
                <NavLink to="/menu" className={({ isActive }) => isActive ? 'active' : ''}>Menu</NavLink>
            </nav>
        </div>
    );
};

export default Sidebar;
