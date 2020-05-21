const { Joi, celebrate } = require('celebrate');

const userCreateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .min(2)
      .max(30)
      .required()
      .label('Длина стоки от 2 до 30 символов'),
    about: Joi.string()
      .min(2).max(30)
      .required()
      .label('Длина стоки от 2 до 30 символов'),
    avatar: Joi.string()
      .pattern(/^https?:\/\//)
      .required()
      .label('Введите URL'),
    email: Joi.string()
      .email()
      .lowercase()
      .required()
      .label('Неверный почтовый адрес'),
    password: Joi.string()
      .min(8)
      .required()
      .label('Неверный пароль'),
  }),
});

const loginValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .label('Неправельный адрес электронной почты'),
    password: Joi.string()
      .required()
      .min(8)
      .label('Неверный пароль'),
  }),
});

const cardCreateValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label('Длина стоки от 2 до 30 символов'),
    link: Joi.string()
      .required()
      .pattern(/^https?:\/\//)
      .label('Введите URL'),
  }),
});
const updateUserValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label('Длина стоки от 2 до 30 символов'),
    about: Joi.string()
      .required()
      .min(2)
      .max(30)
      .label('Длина стоки от 2 до 30 символов'),
  }),
});

const updateUserAvatarValidator = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string()
      .required()
      .pattern(/^https?:\/\//)
      .label('Введите URL'),
  }),
});

module.exports = {
  userCreateValidator,
  loginValidator,
  cardCreateValidator,
  updateUserValidator,
  updateUserAvatarValidator,
};
