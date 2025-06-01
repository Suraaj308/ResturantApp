const mongoose = require('mongoose');
const Order = require('../models/orders');
const Chef = require('../models/chefs');
const Table = require('../models/tables');

exports.placeOrder = async (req, res) => {
    try {
        const orderCount = await Order.countDocuments();
        const orderNumber = orderCount + 1;
        const chef = await Chef.findOne().sort({ cookingTime: 1 });
        if (!chef) return res.status(500).json({ error: "No chefs available" });
        const newOrder = new Order({
            ...req.body,
            orderNumber,
            chefName: chef.chefName
        });

        await newOrder.save();
        chef.numberOfOrders += 1;
        chef.cookingTime += req.body.orderPrepTime;
        await chef.save();
        const { tableName, chairCount, orderType } = req.body;
        if (orderType === "DineIn" && tableName && chairCount) {
            const table = await Table.findOne({
                tableName,
                chairCount,
                tableStatus: "A"
            });

            if (table) {
                table.orderCount += 1;
                await table.save();
            }
        }

        res.status(201).json({ message: "Order placed successfully", order: newOrder });

    } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({ error: "Failed to place order", details: error.message });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};
