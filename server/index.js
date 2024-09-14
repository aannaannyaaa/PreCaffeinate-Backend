const express = require('express');
const mongoose = require('mongoose');
const user = require('./Models/user');
require('dotenv').config();
const app = express();
const port = process.env.port || 8080;
const userRoute = require('./Routes/userRoute');
const order = require('./Models/order');
const orderRoute = require('./Routes/orderRoute');
const menuItemRoute = require('./Routes/menuItemRoute');
const cors = require('cors');

mongoose.connect(process.env.MONGODB_URL,
    {
        serverSelectionTimeoutMS: 100000
    }
)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});

app.use(express.json());

app.use(cors());

app.use('/api/users', userRoute);

app.use('/api/orders', orderRoute);

app.use('/api/menuItems',menuItemRoute);

app.listen(port, () => {    
    console.log("Server is running on port " + port);
});
