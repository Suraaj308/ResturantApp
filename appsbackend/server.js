require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const cors = require('cors');
const authController = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');


const dishRoutes = require('./routes/dishRoutes');
const chefRoutes = require('./routes/chefRoutes');
const tableRoutes = require('./routes/tableRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use(express.json());

connectDB();

app.use(cors({
  origin: 'http://localhost:3000','https://resturant-app-tawny.vercel.app/',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

app.use('/api/dishes', dishRoutes);
app.use('/api/chefs', chefRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);

app.use(express.json());

app.post('/login', authController.login);

app.post('/api/protected', authMiddleware.verifyToken, (req, res) => {
  res.status(200).json({ message: 'Access granted to protected route', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

