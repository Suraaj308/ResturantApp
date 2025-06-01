import './DishCard.css'; // create a CSS file for styling if needed


function DishCard({ dish, count, onAdd, onRemove }) {
  return (
    <div className="dish-card">
      <div className="dish-image" style={{ backgroundImage: `url(${dish.image})` }}></div>
      <div className="dish-details">
        <h3>{dish.dishName}</h3>
        <div className="dish-controls">
          <p className="dish-price">₹{dish.dishPrice}</p>
          <div className="dish-controls2">
            {count > 0 && <button className="minus-btn" onClick={onRemove}>−</button>}
            {count > 0 && <span className="counter">{count}</span>}
            <button className="plus-btn" onClick={onAdd}>＋</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DishCard;
