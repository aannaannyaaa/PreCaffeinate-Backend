const mongoose = require('mongoose');
const User = require('./user');
const MenuItem = require('./menuItem'); 

const orderSchema = new mongoose.Schema({
    orderItems: [
        {
            item: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    orderPrice: {
        type: Number,
        required: true
    },
    orderStatus: {
        type: String,
        enum: ['ordered', 'preparing', 'prepared', 'completed'],
        default: 'ordered'
    },
    razorpayOrderId: {
        type: String,
        required: true
    },
    paymentId: {
        type: String
    }
    }, { timestamps: true });


module.exports = mongoose.model('Order', orderSchema); // Export the model, not the schema
