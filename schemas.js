const baseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
  type: "string",
  base: joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML!",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });
        if (clean !== value)
          return helpers.error("string.escapeHTML", { value });
        return clean;
      },
    },
  },
});
const Joi = baseJoi.extend(extension);
module.exports.hotelSchema = Joi.object({
  title: Joi.string().required().escapeHTML(),

  location: Joi.string().required().escapeHTML(),

  // image: Joi.string().required(),

  price: Joi.number().required(),

  description: Joi.string().required().escapeHTML(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(0).max(5),
  }).required(),
});
