import React from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Orders.css';

function Order() {
  const { state } = useLocation();
  const { orderCounts = {}, menu = [] } = state || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(orderCounts);
  const [mode, setMode] = useState('dine-in');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', address: '', people: '' });
  const [savedFormData, setSavedFormData] = useState(null);
  const [showInstructionsForm, setShowInstructionsForm] = useState(false); // New state for instructions form
  const [cookingInstructions, setCookingInstructions] = useState('');

  useEffect(() => {
    // Update localStorage with cart changes
    localStorage.setItem('orderCounts', JSON.stringify(cart));
  }, [cart]);

  const handleAdd = (dishName) => {
    setCart((prev) => {
      const updated = { ...prev, [dishName]: (prev[dishName] || 0) + 1 };
      return updated;
    });
  };

  const handleRemove = (dishName) => {
    setCart((prev) => {
      const updated = { ...prev, [dishName]: prev[dishName] - 1 };
      if (updated[dishName] <= 0) delete updated[dishName];
      return updated;
    });
  };

  const filteredCartItems = menu.filter(
    (item) => cart[item.dishName] && item.dishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredCartItems.reduce(
    (acc, dish) => acc + dish.dishPrice * cart[dish.dishName],
    0
  );
  const deliveryCharge = mode === 'TakeAway' ? 50 : 0;
  const taxes = Math.round(totalAmount * 0.18);
  const grandTotal = totalAmount + deliveryCharge + taxes;
  const totalPrepTime = filteredCartItems.reduce(
    (acc, dish) => acc + dish.dishPrepTime * cart[dish.dishName],
    0
  );

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setFormData({ ...formData, phone: value });
    }
  };

  const handleSaveForm = () => {
    // Save form data and close form
    setSavedFormData({ ...formData });
    setShowForm(false);
  };

  const handleSaveInstructions = () => {
    // Save cooking instructions and close form
    setShowInstructionsForm(false);
  };

  const handleCancelInstructions = () => {
    // Clear instructions and close form
    setCookingInstructions('');
    setShowInstructionsForm(false);
  };

  const fetchAvailableTable = async (customerCount) => {
    try {
      const [tablesResponse, ordersResponse] = await Promise.all([
        fetch('http://localhost:5000/api/tables'),
        fetch('http://localhost:5000/api/orders')
      ]);

      const tablesData = await tablesResponse.json();
      const ordersData = await ordersResponse.json();

      const currentTime = new Date(); // Use current time instead of hardcoded
      const activeDineInOrders = ordersData.filter((order) => {
        if (order.orderType !== 'DineIn') return false;
        const orderedTime = new Date(order.orderedTime);
        const estimatedTime = new Date(orderedTime.getTime() + order.orderPrepTime * 60 * 1000);
        return currentTime < estimatedTime;
      });

      const updatedTables = tablesData.data.map((table) => {
        const isBooked = activeDineInOrders.some(
          (order) => order.tableName === table.tableName
        );
        return {
          ...table,
          bookingStatus: isBooked ? 'B' : 'N',
        };
      });

      const availableTable = updatedTables.find(
        (table) => table.bookingStatus === 'N' && table.chairCount >= customerCount
      );

      return availableTable ? {
        tableName: availableTable.tableName,
        chairCount: availableTable.chairCount
      } : null;
    } catch (error) {
      console.error('Error fetching table data:', error);
      return null;
    }
  };

  const handleSlideDone = async () => {
    try {
      let tableInfo = null;
      if (mode === 'dine-in' && formData.people) {
        tableInfo = await fetchAvailableTable(parseInt(formData.people));
        if (!tableInfo) {
          alert('No suitable table available for your party size.');
          return;
        }
      }

      const orderDetails = {
        customerName: formData.name,
        customerMobileNumber: formData.phone,
        dishOrdered: Object.entries(cart).map(([dishName, quantity]) => {
          const dish = menu.find((d) => d.dishName === dishName);
          return {
            dishId: dish._id,
            dishName,
            dishCategory: dish.dishCategory,
            dishPrice: dish.dishPrice,
            dishPrepTime: dish.dishPrepTime,
            dishQuantity: quantity,
          };
        }),
        orderType: mode === 'dine-in' ? 'DineIn' : 'TakeAway',
        customerAddress: mode === 'TakeAway' ? formData.address : null,
        customerCount: mode === 'dine-in' ? parseInt(formData.people) || null : null,
        orderPrice: grandTotal,
        orderPrepTime: totalPrepTime,
        orderCookingInstructions: cookingInstructions || null,
        tableName: mode === 'dine-in' && tableInfo ? tableInfo.tableName : null,
        chairCount: mode === 'dine-in' && tableInfo ? tableInfo.chairCount : null,
      };

      const placeOrder = async (orderDetails) => {
        try {
          const response = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderDetails),
          });

          if (!response.ok) {
            throw new Error('Failed to place order');
          }

          return await response.json();
        } catch (error) {
          console.error('Error placing order:', error);
          throw error;
        }
      };
      console.log(JSON.stringify(orderDetails, null, 2));

      await placeOrder(orderDetails);

      // Reset state after successful order
      setCart({});
      localStorage.removeItem('orderCounts');
      setFormData({ name: '', phone: '', address: '', people: '' });
      setSavedFormData(null);
      setCookingInstructions('');
      setShowForm(false);
      alert('Order placed successfully!');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="order-container">
      <h1>Good Evening</h1>
      <p>Place your order here</p>

      <div className="search-container">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search your cart..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="cart-items">
        {filteredCartItems.map((dish) => (
          <div className="cart-item" key={dish._id}>
            <img src={dish.image} alt={dish.dishName} />
            <div className="cart-details">
              <h4>{dish.dishName}</h4>
              <p>₹{dish.dishPrice}</p>
              <div className="quantity-controls">
                <button onClick={() => handleRemove(dish.dishName)}>-</button>
                <span>{cart[dish.dishName]}</span>
                <button onClick={() => handleAdd(dish.dishName)}>+</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="instructions-button"
        onClick={() => setShowInstructionsForm(true)}
      >
        Add cooking instructions
      </button>

      {showInstructionsForm && (
        <div className="instructions-form-popup">
          <h3>Cooking Instructions</h3>
          <textarea
            placeholder="Enter your cooking instructions..."
            value={cookingInstructions}
            onChange={(e) => setCookingInstructions(e.target.value)}
            rows="4"
            cols="30"
          />
          <div className="instructions-form-actions">
            <button onClick={handleCancelInstructions}>Cancel</button>
            <button onClick={handleSaveInstructions}>Next</button>
          </div>
        </div>
      )}

      <div className="mode-toggle">
        <button
          className={mode === 'dine-in' ? 'active' : ''}
          onClick={() => setMode('dine-in')}
        >
          Dine In
        </button>
        <button
          className={mode === 'TakeAway' ? 'active' : ''}
          onClick={() => setMode('TakeAway')}
        >
          TakeAway
        </button>
      </div>

      <div className="pricing-section">
        <p>Subtotal: ₹{totalAmount}</p>
        {mode === 'TakeAway' && <p>Delivery Charge: ₹{deliveryCharge}</p>}
        <p>Taxes (18%): ₹{taxes}</p>
        <h3>Grand Total: ₹{grandTotal}</h3>
      </div>

      {savedFormData && (
        <div className="saved-details">
          <h3>Saved Details</h3>
          <p>Name: {savedFormData.name}</p>
          <p>Phone: {savedFormData.phone}</p>
          {mode === 'TakeAway' && savedFormData.address && (
            <p>Address: {savedFormData.address}</p>
          )}
          {mode === 'dine-in' && savedFormData.people && (
            <p>Number of People: {savedFormData.people}</p>
          )}
        </div>
      )}

      <button className="fill-details-button" onClick={() => setShowForm(true)}>
        Fill Your Details
      </button>

      {showForm && (
        <div className="form-popup">
          <h3>Enter Details</h3>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handlePhoneChange}
            maxLength={10}
          />
          {mode === 'TakeAway' && (
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          )}
          {mode === 'dine-in' && (
            <select
              value={formData.people}
              onChange={(e) => setFormData({ ...formData, people: e.target.value })}
            >
              <option value="" disabled>
                Number of People
              </option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          )}
          <button onClick={handleSaveForm}>Save</button>
        </div>
      )}

      <button className="submit-order-button" onClick={handleSlideDone}>
        Place Order
      </button>
    </div>
  );
}

export default Order;