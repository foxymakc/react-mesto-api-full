const { celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');

const listConditions = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,}\.[a-z0-9]{1,10}\b([-a-z0-9-._~:/?#@!$&'()*+,;=]*)/;

// Вариант 1

const customValidation = (value) => {
  if (!mongoose.isValidObjectId(value)) {
    throw new Error('Не правльный формат id');
  }
  return value;
};

//

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(listConditions),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const idValidation = celebrate({
  params: Joi.object().keys({
    // Вариант 1
    userId: Joi.string().alphanum().custom(customValidation),
    cardId: Joi.string().alphanum().custom(customValidation),
    // Вариант 2
    // userId: Joi.string().alphanum().length(24).hex(),
    // cardId: Joi.string().alphanum().length(24).hex(),
  }),
});

const updateUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const updateAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(listConditions),
  }),
});

const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().pattern(listConditions),
  }),
});

module.exports = {
  loginValidation,
  createUserValidation,
  idValidation,
  updateUserValidation,
  updateAvatarValidation,
  createCardValidation,
};
