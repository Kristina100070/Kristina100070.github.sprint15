const router = require('express').Router();
const cardController = require('../controllers/cards.js');
const { cardCreateValidator } = require('../middlewares/validator');

router.get('/', cardController.findCards);
router.get('/:cardId', cardController.getCardMiddeleware, cardController.findCardById);
router.delete('/:cardId', cardController.getCardMiddeleware, cardController.deleteCard);
router.post('/', cardCreateValidator, cardController.createCard);
router.put('/:cardId/likes', cardController.getCardMiddeleware, cardController.likeCard);
router.delete('/:cardId/likes', cardController.getCardMiddeleware, cardController.dislikeCard);
module.exports = router;
