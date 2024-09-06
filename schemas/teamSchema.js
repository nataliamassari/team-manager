const Joi = require("joi");

const teamCreationSchema = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "O nome deve ser uma string.",
    "string.empty": "O nome não pode estar vazio.",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
    "string.max": "O nome deve ter no máximo {#limit} caracteres.",
    "any.required": "O nome é obrigatório.",
  }),
  description: Joi.string().allow("").max(1000).messages({
    "string.base": "A descrição deve ser uma string.",
    "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
  }),
});

const teamUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(100).messages({
    "string.base": "O nome deve ser uma string.",
    "string.empty": "O nome não pode estar vazio.",
    "string.min": "O nome deve ter pelo menos {#limit} caracteres.",
    "string.max": "O nome deve ter no máximo {#limit} caracteres.",
  }),
  description: Joi.string().allow("").max(1000).messages({
    "string.base": "A descrição deve ser uma string.",
    "string.max": "A descrição deve ter no máximo {#limit} caracteres.",
  }),
  leaderId: Joi.number().integer().positive().messages({
    "number.base": "O líder deve ser um número.",
    "number.integer": "O líder deve ser um número inteiro.",
    "number.positive": "O líder deve ser um número positivo.",
  }),
}).or("name", "description", "leaderId");

const teamDeletionSchema = Joi.object({
  teamId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do time deve ser um número.",
    "number.integer": "O ID do time deve ser um número inteiro.",
    "number.positive": "O ID do time deve ser um número positivo.",
    "any.required": "O ID do time é obrigatório para a deleção.",
  }),
});

module.exports = {
  teamCreationSchema,
  teamUpdateSchema,
  teamDeletionSchema,
};
