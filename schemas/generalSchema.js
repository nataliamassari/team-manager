const Joi = require("joi");

const paginationSchema = Joi.object({
  limit: Joi.number().valid(5, 10, 30).required(),
  page: Joi.number().integer().positive().required(),
});

module.exports = {
  paginationSchema,
};
