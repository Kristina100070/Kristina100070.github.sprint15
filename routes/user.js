const router = require('express').Router();
const userController = require('../controllers/users.js');
const { updateUserValidator, updateUserAvatarValidator } = require('../middlewares/validator');

router.get('/', userController.findUser);
router.get('/:userId', userController.findUserById);
router.patch('/me', updateUserValidator, userController.updateProfile);
router.patch('/me/avatar', updateUserAvatarValidator, userController.updateAvatar);

module.exports = router;
