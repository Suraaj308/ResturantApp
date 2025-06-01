import React from 'react';
import './Ticket.css';

const Ticket = ({ order }) => {
    const orderedTime = new Date(order.orderedTime);
    const estimatedTime = new Date(orderedTime.getTime() + order.orderPrepTime * 60 * 1000); 
    const currentTime = new Date();
    const isOrderDone = currentTime >= estimatedTime;
    const statusText = isOrderDone ? 'Done' : 'Processing';

    const totalItems = order.dishOrdered.reduce((sum, dish) => sum + dish.dishQuantity, 0);

    return (
        <div className="ticket-card">
            <div className="ticket-top">
                <h3>Order #{order.orderNumber}</h3>
                <p>Table: {order.tableName}</p>
                <p>Order Time: {orderedTime.toLocaleString()}</p>
                <p>Items: {totalItems}</p>
                <p>Type: {order.orderType}</p>
                <p>Status: {statusText}</p>
            </div>

            <div className="ticket-middle">
                <h4>Dishes</h4>
                <div className="dish-list">
                    {order.dishOrdered.map((dish) => (
                        <div key={dish._id} className="dish-item">
                            <span>{dish.dishName}</span>
                            <span>Qty: {dish.dishQuantity}</span>
                        </div>
                    ))}
                    {order.orderCookingInstructions && (
                        <p className="cooking-instructions">
                            Instructions: {order.orderCookingInstructions}
                        </p>
                    )}
                </div>
            </div>

            <div className="ticket-bottom">
                <button className={`status-button ${isOrderDone ? 'done' : 'processing'}`}>
                    {statusText}
                </button>
            </div>
        </div>
    );
};

export default Ticket;