const crypto = require('crypto');
const Order = require('../Models/order'); 
const { razorpay_key_secret } = process.env;

const verifyPayment = async (req, res) => {
  const { paymentId, signature } = req.body;
  const { orderId } = req.params;

  try {
    const order = await Order.findOne({ razorpayOrderId: orderId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const generatedSignature = crypto.createHmac('sha256', razorpay_key_secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature === signature) {
      order.status = 'ordered';
      await order.save();

      res.json({ success: true });
    } else {
      await Order.deleteOne({ _id: order._id });
      res.status(400).json({ error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
};

module.exports = { verifyPayment };
