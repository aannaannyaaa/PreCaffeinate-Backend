const router = require("express").Router();
const menuItemController = require('../Controllers/menuItemController');

router.post('/createMenuItem', menuItemController.postMenuItem);

router.get('/', menuItemController.getMenuItems);

router.get('/:id', menuItemController.getMenuItemById);

router.patch('/:id', menuItemController.updateMenuItem);

router.post('/updateAvailability', menuItemController.updateItemsAvailability);

router.delete('/:id', menuItemController.deleteMenuItem);

module.exports = router;