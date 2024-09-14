const router = require("express").Router();
const orderController = require('../Controllers/orderController');
const user = require('../Models/user');
const { verifyPayment } = require('../Controllers/paymentController');


router.post('/createOrder', orderController.postOrder);

router.get('/:id', orderController.getOrderById);

router.patch('/:id', orderController.updateOrder);

router.get('/user/:userId', orderController.getOrderByUserId);

router.delete('/:id', orderController.deleteOrders);

router.get('/', orderController.getAllOrders);

router.patch('/:orderId/verifyPayment', verifyPayment);

module.exports = router;