import Joi from 'joi'

export default {
  signup: {
    body: {
      city: Joi.string().required(),
      cityCode: Joi.string().required(),
      country: Joi.string().required(),
      email: Joi.string().email().required(),
      firstname: Joi.string().alphanum().min(3).max(30).required(),
      lastname: Joi.string().alphanum().min(3).max(30).required(),
      password: Joi.string().min(8).required(),
      paymentMethod: Joi.string().allow('paypal', 'transfer').required(),
      street: Joi.string().required(),
    },
  },
}
