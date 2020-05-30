const cardModel = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

const findCards = (req, res, next) => cardModel.find({})
  .then((card) => {
    res.json(card);
  })
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  const card = cardModel.create({ name, link, owner })
    // eslint-disable-next-line no-shadow
    .then((card) => {
      res.json(card);
    })
    .catch(next);
  return card;
};

const getCardMiddeleware = (req, res, next) => cardModel.findOne({
  _id: req.params.cardId,
})
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    req.card = card;
    next();
  })
  .catch(next);

const findCardById = (req, res) => {
  res.json(req.card);
};

const deleteCard = (req, res, next) => {
  cardModel.findById(req.params.cardId)
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        cardModel.findByIdAndRemove(req.params.cardId)
          .then((cardRemove) => res.send({ remove: cardRemove }))
          .catch(next);
      } else {
        throw new Forbidden('Недостаточно прав для совершения данного действия');
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  cardModel.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } },
    { new: true })
    .then((card) => res.send({ data: card }))
    .catch(next);
};
module.exports = {
  findCards,
  createCard,
  getCardMiddeleware,
  findCardById,
  deleteCard,
  likeCard,
  dislikeCard,
};
