const Joi = require("joi");

const teamMemberCreationSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do usuário deve ser um número.",
    "number.integer": "O ID do usuário deve ser um número inteiro.",
    "number.positive": "O ID do usuário deve ser um número positivo.",
    "any.required": "O ID do usuário é obrigatório.",
  }),
  teamId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do time deve ser um número.",
    "number.integer": "O ID do time deve ser um número inteiro.",
    "number.positive": "O ID do time deve ser um número positivo.",
    "any.required": "O ID do time é obrigatório.",
  }),
});

const teamMemberDeletionSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do usuário deve ser um número.",
    "number.integer": "O ID do usuário deve ser um número inteiro.",
    "number.positive": "O ID do usuário deve ser um número positivo.",
    "any.required":
      "O ID do usuário é obrigatório para deletar um membro do time.",
  }),
  teamId: Joi.number().integer().positive().required().messages({
    "number.base": "O ID do time deve ser um número.",
    "number.integer": "O ID do time deve ser um número inteiro.",
    "number.positive": "O ID do time deve ser um número positivo.",
    "any.required":
      "O ID do time é obrigatório para deletar um membro do time.",
  }),
});

module.exports = {
  teamMemberCreationSchema,
  teamMemberDeletionSchema,
};
