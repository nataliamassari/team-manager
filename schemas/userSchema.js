const Joi = require("joi");

const userCreationSchema = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.base": "O nome de usuário deve ser uma string.",
    "string.empty": "O nome de usuário não pode estar vazio.",
    "string.min": "O nome de usuário deve ter pelo menos {#limit} caracteres.",
    "string.max": "O nome de usuário deve ter no máximo {#limit} caracteres.",
    "any.required": "O nome de usuário é obrigatório.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "O e-mail deve ser uma string.",
    "string.email": "O e-mail deve ter um formato válido.",
    "string.empty": "O e-mail não pode estar vazio.",
    "any.required": "O e-mail é obrigatório.",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "A senha deve ser uma string.",
    "string.empty": "A senha não pode estar vazia.",
    "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
    "any.required": "A senha é obrigatória.",
  }),
  isAdmin: Joi.boolean().default(false).messages({
    "boolean.base": "O campo isAdmin deve ser um valor booleano.",
  }),
});

const userUpdateSchema = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.base": "O nome de usuário deve ser uma string.",
    "string.empty": "O nome de usuário não pode estar vazio.",
    "string.min": "O nome de usuário deve ter pelo menos {#limit} caracteres.",
    "string.max": "O nome de usuário deve ter no máximo {#limit} caracteres.",
  }),
  email: Joi.string().email().messages({
    "string.base": "O e-mail deve ser uma string.",
    "string.email": "O e-mail deve ter um formato válido.",
    "string.empty": "O e-mail não pode estar vazio.",
  }),
  password: Joi.string().min(6).messages({
    "string.base": "A senha deve ser uma string.",
    "string.empty": "A senha não pode estar vazia.",
    "string.min": "A senha deve ter pelo menos {#limit} caracteres.",
  }),
  isAdmin: Joi.boolean().messages({
    "boolean.base": "O campo isAdmin deve ser um valor booleano.",
  }),
}).or("username", "email", "password", "isAdmin");

module.exports = {
  userCreationSchema,
  userUpdateSchema,
};
