import React, { useState, useEffect } from 'react';
import './App.css';
import DishCard from './DishCard.js';
import { useNavigate } from 'react-router-dom';

const getCategoryIcon = (category) => {
  switch (category) {
    case 'Burgers':
      return '🍔';
    case 'Pizzas':
      return '🍕';
    case 'Drinks':
      return '🥤';
    case 'Fries':
      return '🍟';
    case 'Veggies':
      return '🥗';
    default:
      return '🍽️';
  }
};

function App() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderCounts, setOrderCounts] = useState({});

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/api/dishes`);
        if (!response.ok) throw new Error('Failed to fetch dishes');
        const data = await response.json();
        setMenu(data);
        const uniqueCategories = [...new Set(data.map((dish) => dish.dishCategory))];
        setCategories(uniqueCategories);
        setSelectedCategory(uniqueCategories[0] || '');
      } catch (error) {
        console.error('Error fetching dishes:', error);
      }
    };
    fetchDishes();
  }, []);

  const handleAddToOrder = (dishName) => {
    setOrderCounts((prev) => ({
      ...prev,
      [dishName]: (prev[dishName] || 0) + 1,
    }));
  };

  const handleRemoveFromOrder = (dishName) => {
    setOrderCounts((prev) => {
      const updated = { ...prev, [dishName]: prev[dishName] - 1 };
      if (updated[dishName] <= 0) delete updated[dishName];
      return updated;
    });
  };

  const filteredDishes = menu.filter(
    (dish) =>
      dish.dishCategory === selectedCategory &&
      dish.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalItems = Object.values(orderCounts).reduce((a, b) => a + b, 0);

  const handleNext = () => {
    navigate('/placeorder', { state: { orderCounts, menu } });
  };

  return (
    <div className="app-container">
      <p id="goodeveningheading">Good Evening</p>
      <p>Place your order here</p>
      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
          >
            <div className="category-icon">{getCategoryIcon(category)}</div>
            <div className="category-label">{category}</div>
          </button>
        ))}
      </div>

      <h2 className="category-heading">{selectedCategory}</h2>

      <div className="dishes-container">
        {filteredDishes.map((dish) => (
          <DishCard
            key={dish._id}
            dish={dish}
            count={orderCounts[dish.dishName] || 0}
            onAdd={() => handleAddToOrder(dish.dishName)}
            onRemove={() => handleRemoveFromOrder(dish.dishName)}
          />
        ))}
      </div>

      {totalItems > 0 && (
        <button className="next-button" onClick={handleNext}>
          Next
        </button>
      )}
    </div>
  );
}

export default App;