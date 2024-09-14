const router = require("express").Router();
const userController = require('../Controllers/userController');
const userModel = require('../Models/user');
const authenticate = require('../middlewares/auth');

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.get('/', userController.getAllUsers);

router.patch('/:id', userController.updateUser);

router.get('/currentUser', authenticate , userController.getLoggedInUser);

router.get('/partner-requests', userController.getPartnerRequests);

router.post('/partner-requests/:userId', userController.sendPartnerRequest);

router.post('/partner-requests/:userId/approve', userController.approvePartnerRequest);

router.post('/partner-requests/:userId/reject', userController.rejectPartnerRequest);

module.exports = router;